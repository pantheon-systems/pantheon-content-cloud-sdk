import { mkdir, writeFile } from "fs/promises";
import path from "path";
import axios, { AxiosError } from "axios";
import { Octokit } from "octokit";

const octokit = new Octokit();

const owner = "pantheon-systems";
const repo = "pantheon-content-cloud-sdk";

interface File {
  path: string;
  contents: Buffer;
}

interface TreeNode {
  path: string;
}

export async function downloadTemplateDirectory(
  directory: string,
  outputDirectory: string,
  printVerbose?: boolean,
) {
  try {
    const files = await fetchFiles(directory, printVerbose);

    await Promise.all(files.map((file) => output(file, outputDirectory)));

    return path.resolve(outputDirectory);
  } catch (error) {
    throw new Error("Error fetching starter kit from Github: " + error);
  }
}

async function output(file: File, outputDirectory: string) {
  const outputPath = path.join(outputDirectory, file.path);
  const dir = path.dirname(outputPath);

  await mkdir(dir, { recursive: true });
  await writeFile(outputPath, file.contents);
}

async function fetchFiles(directory: string, printVerbose?: boolean) {
  const { data } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner,
      repo,
      tree_sha: "main",
      recursive: "true",
    },
  );

  const files = data.tree
    .filter((node): node is TreeNode =>
      Boolean(node.path?.startsWith(directory) && node.type === "blob"),
    )
    .map((node) => node.path);

  const downloadPromises = files.map(async (path) => {
    if (printVerbose) {
      console.log(`Downloading ${path}`);
    }

    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;

    async function attemptDownload(url: string, retryAllowed: boolean) {
      try {
        const { data } = await axios.get(url, {
          responseType: "arraybuffer",
        });

        return {
          path: path.replace(directory, ""),
          contents: data,
        };
      } catch (e) {
        if (e instanceof AxiosError && e.code === "ENOTFOUND" && retryAllowed) {
          console.error(
            `Failed to download ${url}, but reattempting one time.`,
          );
          return attemptDownload(url, false);
        }

        console.error(`Failed to download ${url}`);
        throw e;
      }
    }

    return attemptDownload(url, true);
  });

  return Promise.all(downloadPromises);
}
