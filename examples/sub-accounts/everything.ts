import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ORGANIZATION_ID = "<YOUR-ORGANIZATION-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  organizationId: Number(ORGANIZATION_ID),
});

const subAccountsClient = client.organizations.subAccounts;

async function subAccountsFlow() {
  try {
    // List sub accounts under the organization.
    // Requires sub-account management permissions on the token.
    const all = await subAccountsClient.getList();
    console.log("All sub accounts:", JSON.stringify(all, null, 2));

    // Create a new sub account under the organization
    const created = await subAccountsClient.create({
      name: "Acme Marketing",
    });
    console.log("Created sub account:", JSON.stringify(created, null, 2));
  } catch (error) {
    console.error("Error in subAccountsFlow:", error instanceof Error ? error.message : String(error));
  }
}

subAccountsFlow();
