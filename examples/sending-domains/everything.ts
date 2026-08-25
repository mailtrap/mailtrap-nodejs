import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: Number(ACCOUNT_ID),
});

async function sendingDomainsFlow() {
  try {
    // Get all sending domains
    const all = await client.sendingDomains.getList();
    console.log("All sending domains:", JSON.stringify(all, null, 2));

    if (!all.data || all.data.length === 0) {
      console.log("No sending domains found for this account.");
      return;
    }

    // Get a specific sending domain
    const one = await client.sendingDomains.get(all.data[0].id);
    console.log("One sending domain:", JSON.stringify(one, null, 2));

    // Send setup instructions
    const setupResponse = await client.sendingDomains.sendSetupInstructions(
      all.data[0].id,
      "admin@example.com"
    );
    console.log("Setup instructions sent");

    // Create a new sending domain
    const created = await client.sendingDomains.create({
      domain_name: "test-domain-" + Date.now() + ".com",
    });
    console.log("Created sending domain:", JSON.stringify(created, null, 2));

    // Update the settings of the created domain
    const updated = await client.sendingDomains.update(created.id, {
      open_tracking_enabled: true,
      click_tracking_enabled: true,
      tracking_opt_out_enabled: true,
      auto_unsubscribe_link_enabled: false,
      inbound_enabled: false,
    });
    console.log("Updated sending domain:", JSON.stringify(updated, null, 2));

    // Delete the created domain
    await client.sendingDomains.delete(created.id);
    console.log("Sending domain deleted");

  } catch (error) {
    console.error("Error in sendingDomainsFlow:", error instanceof Error ? error.message : String(error));
  }
}

sendingDomainsFlow();
