import inquirer from "inquirer";
import ora from "ora";
import AddOnApiHelper from "../../../lib/addonApiHelper";
import { errorHandler } from "../../exceptions";

async function configurePreferredWebhookEvents(siteId: string) {
  // Fetch available events
  const availableEventsSpinner = ora("Fetching available events...").start();
  const availableEvents =
    await AddOnApiHelper.fetchAvailableWebhookEvents(siteId);
  availableEventsSpinner.succeed("Fetched available events");

  // Prompt user to select events
  const { selectedEvents } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedEvents",
      message:
        "Select events to receive notifications for. Select none to receive notifications for all events.",
      choices: availableEvents,
    },
  ]);

  if (selectedEvents.length === 0) {
    console.info(
      "No events selected. Your webhook will receive notifications for all events.",
    );
  }

  // Update events for the site
  const updateEventsSpinner = ora("Updating preferred events...").start();
  await AddOnApiHelper.updateSiteConfig(siteId, {
    preferredEvents: selectedEvents,
  });
  updateEventsSpinner.succeed("Updated preferred events");
}

export default errorHandler(configurePreferredWebhookEvents);
