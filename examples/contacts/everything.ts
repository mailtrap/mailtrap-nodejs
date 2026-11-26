import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

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

const contactData = {
  email: "john.smith@example.com",
  fields: {
    first_name: "John",
    last_name: "Smith"
  },
};

// Create contact first
client.contacts
  .create(contactData)
  .then(async (createResponse) => {
    console.log("Contact created:", createResponse.data);
    const contactId = createResponse.data.id;

    // Get contact by email
    const getResponse = await client.contacts.get(contactData.email);
    console.log("Contact retrieved:", getResponse.data);

    // Update contact
    const updateResponse = await client.contacts
      .update(contactId, {
        email: contactData.email,
        fields: {
          first_name: "Johnny",
          last_name: "Smith",
        }
      })
    console.log("Contact updated:", updateResponse.data);

    // Unsubscribe the contact from one subscription topic on one domain. The
    // topic and domain pairs left out keep their status. Contact responses
    // list every pair in `subscription_topics`: it is absent on an account
    // without subscription topics, and `null` when they couldn't be read.
    const topicPreference = await findTopicPreference();
    if (topicPreference) {
      const topicsResponse = await client.contacts.update(contactId, {
        email: contactData.email,
        subscription_topics: [topicPreference],
      });
      console.log(
        "Contact subscription topics:",
        topicsResponse.data.subscription_topics
      );
    }

    // Delete contact
    await client.contacts.delete(contactId);
    console.log("Contact deleted");
  })
  .catch(error => {
    console.error("Error in contact lifecycle:", error);
  });
