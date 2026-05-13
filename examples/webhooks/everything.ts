import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

async function webhooksFlow() {
  try {
    // List all webhooks for the account
    const all = await client.webhooks.getList();
    console.log("All webhooks:", JSON.stringify(all, null, 2));

    // Create a new webhook. `signing_secret` is only returned here — store it
    // securely; it is used to verify webhook payload signatures.
    const created = await client.webhooks.create({
      url: "https://example.com/webhooks/mailtrap",
      webhook_type: "email_sending",
      active: true,
      payload_format: "json",
      sending_stream: "transactional",
      event_types: ["delivery", "bounce", "open", "click", "unsubscribe"],
    });
    console.log("Created webhook:", JSON.stringify(created, null, 2));
    console.log("Signing secret (store securely):", created.data.signing_secret);

    const webhookId = created.data.id;

    // Get a single webhook by ID (signing_secret is NOT returned here)
    const one = await client.webhooks.get(webhookId);
    console.log("One webhook:", JSON.stringify(one, null, 2));

    // Update the webhook. Only url, active, payload_format and event_types
    // are mutable; webhook_type/sending_stream/domain_id are immutable.
    const updated = await client.webhooks.update(webhookId, {
      url: "https://example.com/webhooks/mailtrap/v2",
      active: false,
      event_types: ["delivery", "bounce"],
    });
    console.log("Updated webhook:", JSON.stringify(updated, null, 2));

    // Delete the webhook
    const deleted = await client.webhooks.delete(webhookId);
    console.log("Deleted webhook:", JSON.stringify(deleted, null, 2));
  } catch (error) {
    console.error("Error in webhooksFlow:", error instanceof Error ? error.message : String(error));
  }
}

webhooksFlow();
