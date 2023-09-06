import { readFileSync } from "fs";
import http from "http";
import type { AddressInfo } from "net";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
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

  // Relinquish port determination to OS
  const port = (server.address() as AddressInfo).port ?? DEFAULT_PORT;

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

async function showLogs({ id, limit }: ShowLogsArgs) {
  const offset = 0;

  let logs: WebhookDeliveryLog[] = [];

  const spinner = ora("Fetching logs...").start();
  try {
    logs = await AddOnApiHelper.fetchWebhookLogs(id, {
      limit,
      offset,
    });
    spinner.succeed("Successfully fetched logs.");
  } catch (error) {
    spinner.fail(
      chalk.red("Failed to fetch logs. Please try again or contact support"),
    );
    throw error;
  }

  // // DEBUG: Repeat logs until we have 50 logs
  // while (logs.length < 50) {
  //   logs = [...logs, ...logs];
  // }

  // Setup listening server
  const { server, address } = await setupLogViewerServer(logs);

  console.log(`Visit ${address} to view logs`);
}

export default errorHandler<ShowLogsArgs>(showLogs);
