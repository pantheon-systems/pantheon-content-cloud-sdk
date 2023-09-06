import { readFileSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import readline from "readline";
import { fileURLToPath } from "url";
import chalk from "chalk";
import getPort from "get-port";
import nunjucks from "nunjucks";
import open from "open";
import ora from "ora";
import destroyer from "server-destroy";
import AddOnApiHelper from "../../lib/addonApiHelper";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

const DEFAULT_PORT = 3030;

type ShowLogsArgs = {
  id: string;
  limit?: number;
};

async function setupLogViewerServer(logs: WebhookDeliveryLog[]) {
  const server = http.createServer(async (req, res) => {
    const currDir = dirname(fileURLToPath(import.meta.url));
    const template = readFileSync(join(currDir, "../templates/logs.html"));

    res.end(
      nunjucks.renderString(template.toString(), {
        logs: JSON.stringify(logs, null, 2),
      }),
    );
  });

  // Random free port
  const port = await getPort({ port: DEFAULT_PORT });

  const address = `http://localhost:${port}/`;

  server.listen(port, () => {
    open(address, { wait: true }).then((cp) => cp.kill());
  });

  destroyer(server);

  return {
    server,
    address,
  };
}

async function fetchLogs(id: string, limit: number, offset: number) {
  const spinner = ora("Fetching logs...").start();
  try {
    const logs = await AddOnApiHelper.fetchWebhookLogs(id, {
      limit,
      offset,
    });

    spinner.succeed("Successfully fetched logs.");
    return logs;
  } catch (error) {
    spinner.fail(
      chalk.red("Failed to fetch logs. Please try again or contact support"),
    );
    throw error;
  }
}

async function showLogs({ id, limit: _limit }: ShowLogsArgs) {
  const limit = _limit || 100;
  let offset = 0;

  let logs: WebhookDeliveryLog[] = await fetchLogs(id, limit, offset);

  // Setup listening server
  const { server, address } = await setupLogViewerServer(logs);

  console.log(`Visit ${address} to view logs`);
  console.log("Press <SPACE> to load more logs");
  console.log("Press q to quit");

  readline.emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  process.stdin.on("keypress", async (chunk, key) => {
    if (key && key.name == "q") {
      server.destroy();
      process.exit();
    }

    if (key && key.name == "space") {
      // Load more logs
      const newOffset = offset + limit;

      const newLogs = await fetchLogs(id, limit, newOffset);

      offset = newOffset;
      logs = [...newLogs, ...logs];
    }
  });
}

export default errorHandler<ShowLogsArgs>(showLogs);
