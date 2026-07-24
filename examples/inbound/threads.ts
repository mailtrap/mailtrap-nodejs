import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const INBOX_ID = Number("<YOUR-INBOX-ID-HERE>");

// Set to a real thread id to try deletion below. Left empty, the example is
// read-only (list + get).
const THREAD_ID = "";

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

    if (list.data.length > 0) {
      console.log(
        "First thread:",
        await threadsClient.get(INBOX_ID, list.data[0].id)
      );
    }

    if (!THREAD_ID) {
      console.log("Set THREAD_ID above to try deletion.");
      return;
    }

    // Deletes a real thread — only run against one you own.
    await threadsClient.delete(INBOX_ID, THREAD_ID);
    console.log("Deleted thread", THREAD_ID);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

threadsFlow();
