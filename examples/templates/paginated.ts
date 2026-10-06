import { MailtrapClient } from "mailtrap";

// The /api/templates endpoints are experimental: their request and response
// shapes may change before general availability.

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function paginatedTemplatesFlow() {
  // Create a new template
  const newTemplate = await client.paginatedTemplates.create({
    name: "Welcome Email",
    subject: "Welcome to Our Service!",
    category: "Promotional",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our service.</p>",
    body_text: "Welcome! Thank you for joining our service."
  });
  console.log("Created template:", newTemplate.data);

  // List every template, one page at a time (page-token pagination)
  let token: number | null = 1;
  while (token !== null) {
    const page = await client.paginatedTemplates.getList({ per_page: 50, token });
    console.log("Templates:", page.data);
    token = page.pagination.next_token;
  }

  // Get a specific template
  const template = await client.paginatedTemplates.get(newTemplate.data.id);
  console.log("Template details:", template.data);

  // Update the template
  const updatedTemplate = await client.paginatedTemplates.update(newTemplate.data.id, {
    name: "Updated Welcome Email",
    subject: "Welcome to Our Amazing Service!",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our amazing service.</p>"
  });
  console.log("Updated template:", updatedTemplate.data);

  // Delete the template
  await client.paginatedTemplates.delete(newTemplate.data.id);
  console.log("Template deleted successfully");
}

paginatedTemplatesFlow().catch(console.error);

