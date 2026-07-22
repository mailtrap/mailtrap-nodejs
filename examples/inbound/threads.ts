import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const INBOX_ID = Number("<YOUR-INBOX-ID-HERE>");

// Inbound is scoped to the token's account, so no accountId is required.
const client = new MailtrapClient({ token: TOKEN });
const threadsClient = client.inbound.threads;

async function threadsFlow() {
  try {
    const list = await threadsClient.getList(INBOX_ID);
    console.log("Threads:", list);

    // Fetch the next page with the returned cursor.
    if (list.last_id) {
      console.log(
        "Next page:",
        await threadsClient.getList(INBOX_ID, { last_id: list.last_id })
      );
    }

    if (list.data.length === 0) {
      console.log("No threads yet.");
      return;
    }

    const threadId = list.data[0].id;

    console.log(
      "Thread with messages:",
      await threadsClient.get(INBOX_ID, threadId)
    );

    await threadsClient.delete(INBOX_ID, threadId);
    console.log("Deleted thread", threadId);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

threadsFlow();
