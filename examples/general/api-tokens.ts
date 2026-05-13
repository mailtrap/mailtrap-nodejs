import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

const apiTokensClient = client.general.apiTokens;

async function apiTokensFlow() {
  try {
    // List all API tokens visible to the current token. The full token value
    // is never returned here — only `last_4_digits`.
    const all = await apiTokensClient.getList();
    console.log("All API tokens:", JSON.stringify(all, null, 2));

    // Create a new API token scoped to specific resources.
    // The full `token` value is returned only in this response — store it securely.
    const created = await apiTokensClient.create({
      name: "My token",
      resources: [
        { resource_type: "account", resource_id: Number(ACCOUNT_ID), access_level: 10 },
      ],
    });
    console.log("Created API token:", JSON.stringify(created, null, 2));
    console.log("Token value (store securely):", created.token);

    const tokenId = created.id;

    // Get a single API token by ID (full token value is not included)
    const one = await apiTokensClient.get(tokenId);
    console.log("One API token:", JSON.stringify(one, null, 2));

    // Reset the API token: expires the existing token and returns a new one
    // with the same permissions. The new `token` value is only returned here.
    const reset = await apiTokensClient.reset(tokenId);
    console.log("Reset API token:", JSON.stringify(reset, null, 2));
    console.log("New token value (store securely):", reset.token);

    // Permanently delete the API token
    await apiTokensClient.delete(tokenId);
    console.log("API token deleted");
  } catch (error) {
    console.error("Error in apiTokensFlow:", error instanceof Error ? error.message : String(error));
  }
}

apiTokensFlow();
