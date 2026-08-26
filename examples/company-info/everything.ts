import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const DOMAIN_ID = Number("<YOUR-DOMAIN-ID-HERE>");

const client = new MailtrapClient({ token: TOKEN });

async function companyInfoFlow() {
  try {
    // Create the company info required for compliance verification
    const created = await client.companyInfo.create(DOMAIN_ID, {
      name: "Mailtrap",
      address: "123 Main St",
      city: "San Francisco",
      country: "US",
      zip_code: "94105",
      website_url: "https://mailtrap.io",
      phone: "+1-555-0100",
      privacy_policy_url: "https://mailtrap.io/privacy",
      terms_of_service_url: "https://mailtrap.io/terms",
      info_level: "business",
    });
    console.log("Created company info:", JSON.stringify(created, null, 2));

    // Get the company info of a sending domain
    const companyInfo = await client.companyInfo.get(DOMAIN_ID);
    console.log("Company info:", JSON.stringify(companyInfo, null, 2));

    // Update only some of the fields
    const updated = await client.companyInfo.update(DOMAIN_ID, {
      city: "New York",
      zip_code: "10001",
    });
    console.log("Updated company info:", JSON.stringify(updated, null, 2));
  } catch (error) {
    console.error(
      "Error in companyInfoFlow:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

companyInfoFlow();
