import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";

// Inbound is scoped to the token's account, so no accountId is required.
const client = new MailtrapClient({ token: TOKEN });
const foldersClient = client.inbound.folders;

async function foldersFlow() {
  try {
    const created = await foldersClient.create({ name: "Support" });
    console.log("Created folder:", created);

    console.log("All folders:", await foldersClient.getList());
    console.log("One folder:", await foldersClient.get(created.id));

    const updated = await foldersClient.update(created.id, {
      name: "Customer Success",
    });
    console.log("Updated folder:", updated);

    await foldersClient.delete(created.id);
    console.log("Deleted folder", created.id);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

foldersFlow();
