import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

async function emailLogsFlow() {
  try {
    // List email logs (paginated)
    const list = await client.emailLogs.getList();
    console.log("Email logs:", list.messages.length, "messages, total:", list.total_count);
    if (list.messages.length > 0) {
      console.log("First message:", list.messages[0].message_id, list.messages[0].subject);
    }

    // List with filters (date range, category, status). Filter values can be single or array.
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const filtered = await client.emailLogs.getList({
      filters: {
        sent_after: twoDaysAgo.toISOString(),
        sent_before: now.toISOString(),
        subject: { operator: "not_empty" },
        to: { operator: "ci_equal", value: "recipient@example.com" },
        category: { operator: "equal", value: ["Welcome Email", "Forget Password"] },
      },
    });
    console.log("Filtered logs:", filtered.messages.length);

    // Next page (use search_after from previous response next_page_cursor)
    if (list.next_page_cursor) {
      const nextPage = await client.emailLogs.getList({
        search_after: list.next_page_cursor,
      });
      console.log("Next page:", nextPage.messages.length, "messages");
    }

    // Get a single message by ID
    if (list.messages.length > 0) {
      const messageId = list.messages[0].message_id;
      const message = await client.emailLogs.get(messageId);
      console.log("Single message:", message.subject, "events:", message.events?.length ?? 0);
    }
  } catch (error) {
    console.error("Error in emailLogsFlow:", error instanceof Error ? error.message : String(error));
  }
}

emailLogsFlow();
