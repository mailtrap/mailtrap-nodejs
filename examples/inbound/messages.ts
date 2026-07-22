import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const INBOX_ID = Number("<YOUR-INBOX-ID-HERE>");

// Set to a real message id to try the mutating actions (reply / reply-all /
// forward / delete). Left empty, the example is read-only (list + get).
const MESSAGE_ID = "";

// Inbound is scoped to the token's account, so no accountId is required.
const client = new MailtrapClient({ token: TOKEN });
const messagesClient = client.inbound.messages;

async function messagesFlow() {
  try {
    const list = await messagesClient.getList(INBOX_ID);
    console.log("Messages:", list);

    // Fetch the next page with the returned cursor.
    if (list.last_id) {
      console.log(
        "Next page:",
        await messagesClient.getList(INBOX_ID, { last_id: list.last_id })
      );
    }

    if (list.data.length > 0) {
      console.log(
        "First message:",
        await messagesClient.get(INBOX_ID, list.data[0].id)
      );
    }

    if (!MESSAGE_ID) {
      console.log(
        "Set MESSAGE_ID above to try reply / reply-all / forward / delete."
      );
      return;
    }

    // These act on a real message: reply/reply_all/forward SEND email, and
    // delete removes the message. Only run against a message you own.
    console.log(
      "Reply:",
      await messagesClient.reply(INBOX_ID, MESSAGE_ID, {
        text: "Thanks for reaching out — we are looking into it.",
      })
    );

    await messagesClient.replyAll(INBOX_ID, MESSAGE_ID, {
      text: "Looping everyone in.",
    });

    await messagesClient.forward(INBOX_ID, MESSAGE_ID, {
      to: [{ email: "colleague@example.com" }],
      text: "Please take a look.",
    });

    await messagesClient.delete(INBOX_ID, MESSAGE_ID);
    console.log("Deleted message", MESSAGE_ID);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

messagesFlow();
