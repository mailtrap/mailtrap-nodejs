import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";

// The Subscription Topics API is token-scoped — no `accountId` is needed.
const client = new MailtrapClient({ token: TOKEN });

// An account without subscription topics answers `403` with an empty body.
const isForbidden = (error: unknown) =>
  (error as { cause?: { response?: { status?: number } } }).cause?.response
    ?.status === 403;

async function subscriptionTopicsFlow() {
  try {
    // List every topic, one page at a time (page-token pagination). The list
    // leaves out deleted topics. A `domain_id` of `null` means the topic
    // covers every domain.
    const topics = [];
    let token: number | null = 1;
    while (token !== null) {
      const page = await client.subscriptionTopics.getList({
        per_page: 50,
        token,
      });
      topics.push(...page.data);
      token = page.pagination.next_token;
    }
    console.log("Subscription topics:", JSON.stringify(topics, null, 2));

    if (topics.length === 0) {
      console.log("No subscription topics found for this account.");
      return;
    }

    // Get one topic by ID. `get` also returns a deleted topic, with
    // `deleted_at` set.
    const topic = await client.subscriptionTopics.get(topics[0].id);
    console.log("One topic:", JSON.stringify(topic.data, null, 2));
  } catch (error) {
    if (isForbidden(error)) {
      console.error("Subscription topics are not available for this account.");
      return;
    }

    console.error(
      "Error in subscriptionTopicsFlow:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

subscriptionTopicsFlow();
