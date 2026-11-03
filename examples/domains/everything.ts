import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

async function domainsFlow() {
  try {
    // Get all domains
    const all = await client.domains.getList();
    console.log("All domains:", JSON.stringify(all, null, 2));

    if (!all.data || all.data.length === 0) {
      console.log("No domains found for this account.");
      return;
    }

    // Get a specific domain
    const one = await client.domains.get(all.data[0].id);
    console.log("One domain:", JSON.stringify(one, null, 2));

    // Send setup instructions
    const setupResponse = await client.domains.sendSetupInstructions(
      all.data[0].id,
      "admin@example.com"
    );
    console.log("Setup instructions sent");

    // Create a new domain
    const created = await client.domains.create({
      domain_name: "test-domain-" + Date.now() + ".com",
    });
    console.log("Created domain:", JSON.stringify(created, null, 2));

    // Update the settings of the created domain
    const updated = await client.domains.update(created.id, {
      open_tracking_enabled: true,
      click_tracking_enabled: true,
      tracking_opt_out_enabled: true,
      auto_unsubscribe_link_enabled: false,
      inbound_enabled: false,
    });
    console.log("Updated domain:", JSON.stringify(updated, null, 2));

    // Delete the created domain
    await client.domains.delete(created.id);
    console.log("Domain deleted");

  } catch (error) {
    console.error("Error in domainsFlow:", error instanceof Error ? error.message : String(error));
  }
}

domainsFlow();
