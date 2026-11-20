import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

// An account without subscription topics answers `403` with an empty body.
const isForbidden = (error: unknown) =>
  (error as { cause?: { response?: { status?: number } } }).cause?.response
    ?.status === 403;

// A preference for the account's first subscription topic, on the topic's
// domain or, for an "All domains" topic, on the account's first domain.
// Returns `undefined` on an account without subscription topics.
async function findTopicPreference() {
  try {
    const topics = await client.subscriptionTopics.getList({ per_page: 1 });
    const topic = topics.data[0];
    if (!topic) return undefined;

    const domainId =
      topic.domain_id ?? (await client.domains.getList()).data[0]?.id;
    if (domainId === undefined) return undefined;

    return {
      subscription_topic_id: topic.id,
      domain_id: domainId,
      status: "unsubscribed" as const,
    };
  } catch (error) {
    if (isForbidden(error)) return undefined;
    throw error;
  }
}

async function runContactImportsFlow() {
  // A contact's `subscription_topics` sets its status for each topic and
  // domain pair given; an import that sends them fails on an account without
  // subscription topics.
  const topicPreference = await findTopicPreference();
  const importData = {
    contacts: [
      {
        email: "customer1@example.com",
        ...(topicPreference && { subscription_topics: [topicPreference] })
      },
      {
        email: "customer2@example.com"
      }
    ]
  };

  try {
    // Create import
    const response = await client.contactImports.create(importData);
    console.log("Import created:", response);

    // Get import by ID
    const importDetails = await client.contactImports.get(response.id);
    console.log("Import details:", importDetails);
  } catch (error: any) {
    console.error("Error:", error);
  }
}

runContactImportsFlow();
