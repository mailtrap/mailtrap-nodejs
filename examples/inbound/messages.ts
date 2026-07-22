import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const INBOX_ID = Number("<YOUR-INBOX-ID-HERE>");

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

    if (list.data.length === 0) {
      console.log("No messages yet — send an email to the inbox address first.");
      return;
    }

    const messageId = list.data[0].id;

    console.log(
      "Message details:",
      await messagesClient.get(INBOX_ID, messageId)
    );

    // Reply to the original sender.
    console.log(
      "Reply:",
      await messagesClient.reply(INBOX_ID, messageId, {
        text: "Thanks for reaching out — we are looking into it.",
      })
    );

    // Reply to everyone on the original message.
    await messagesClient.replyAll(INBOX_ID, messageId, {
      text: "Looping everyone in.",
    });

    // Forward requires at least one recipient.
    await messagesClient.forward(INBOX_ID, messageId, {
      to: [{ email: "colleague@example.com" }],
      text: "Please take a look.",
    });

    await messagesClient.delete(INBOX_ID, messageId);
    console.log("Deleted message", messageId);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

messagesFlow();
