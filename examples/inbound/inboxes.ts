import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const FOLDER_ID = Number("<YOUR-FOLDER-ID-HERE>");

// Inbound is scoped to the token's account, so no accountId is required.
const client = new MailtrapClient({ token: TOKEN });
const inboxesClient = client.inbound.inboxes;

async function inboxesFlow() {
  try {
    // Omit domain_id for a Mailtrap-hosted inbox; pass it to create a
    // custom-domain (catch-all) inbox.
    const created = await inboxesClient.create(FOLDER_ID, { name: "Tickets" });
    console.log("Created inbox:", created);

    console.log("All inboxes:", await inboxesClient.getList(FOLDER_ID));
    console.log("One inbox:", await inboxesClient.get(FOLDER_ID, created.id));

    const updated = await inboxesClient.update(FOLDER_ID, created.id, {
      name: "Tickets (renamed)",
    });
    console.log("Updated inbox:", updated);

    await inboxesClient.delete(FOLDER_ID, created.id);
    console.log("Deleted inbox", created.id);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

inboxesFlow();
