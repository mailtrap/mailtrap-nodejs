import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function suppressionsFlow() {
  // Get suppressions (up to 1000 per request)
  const suppressions = await client.suppressions.getList();
  console.log("Suppressions (up to 1000):", suppressions);

  // Get suppressions filtered by email
  const filteredSuppressions = await client.suppressions.getList({email: "test@example.com"});
  console.log("Filtered suppressions:", filteredSuppressions);

  // Count the suppressions created in the last 30 days. A full page has 1000
  // rows; pass the last row's `id` as `last_id` to get the next one.
  const startTime = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  let recentCount = 0;
  let lastId: string | undefined;
  let page;
  do {
    page = await client.suppressions.getList({start_time: startTime, last_id: lastId});
    recentCount += page.length;
    lastId = page[page.length - 1]?.id;
  } while (page.length === 1000);
  console.log("Suppressions from the last 30 days:", recentCount);

  // Include contacts' unsubscriptions from single subscription topics, as
  // "topic unsubscription" rows with their `subscription_topic_id`. Needs a
  // token that can read contacts; without subscription topics there are none.
  const withTopics = await client.suppressions.getList({
    include_topic_unsubscriptions: true
  });
  console.log(
    "Topic unsubscriptions:",
    withTopics.filter((suppression) => suppression.type === "topic unsubscription")
  );

  // Add an email to the suppression list. `type` defaults to "manual import".
  const created = await client.suppressions.create({
    email: "suppressed@example.com",
    domain_id: 12345,
    sending_stream: "transactional"
  });
  console.log("Created suppression:", created.data);

  // Delete a suppression by ID (if any exist). The list without
  // `include_topic_unsubscriptions` has no topic unsubscriptions, which can't
  // be deleted.
  if (suppressions.length > 0) {
    const suppressionToDelete = suppressions[0];
    await client.suppressions.delete(suppressionToDelete.id);
    console.log(`Suppression ${suppressionToDelete.id} deleted successfully`);
  } else {
    console.log("No suppressions found to delete");
  }
}

suppressionsFlow().catch(console.error);
