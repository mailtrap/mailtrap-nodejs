import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>";

const client = new MailtrapClient({
  token: TOKEN,
  accountId: ACCOUNT_ID
});

async function templatesFlow() {
  // Create a new template
  const newTemplate = await client.templates.create({
    name: "Welcome Email",
    subject: "Welcome to Our Service!",
    category: "Promotional",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our service.</p>",
    body_text: "Welcome! Thank you for joining our service."
  });
  console.log("Created template:", newTemplate);

  // Get all templates
  const allTemplates = await client.templates.getList();
  console.log("All templates:", allTemplates);

  // Get a specific template
  const template = await client.templates.get(newTemplate.id);
  console.log("Template details:", template);

  // Update the template
  const updatedTemplate = await client.templates.update(newTemplate.id, {
    name: "Updated Welcome Email",
    subject: "Welcome to Our Amazing Service!",
    body_html: "<h1>Welcome!</h1><p>Thank you for joining our amazing service.</p>"
  });
  console.log("Updated template:", updatedTemplate);

  // Delete the template
  await client.templates.delete(newTemplate.id);
  console.log("Template deleted successfully");
}

templatesFlow().catch(console.error);

