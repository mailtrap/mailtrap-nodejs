import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const DOMAIN_ID = Number("<YOUR-DOMAIN-ID-HERE>");

const client = new MailtrapClient({ token: TOKEN });

async function trackingOptOutsFlow() {
  // Opt an email out of open and click tracking for a sending domain
  const created = await client.trackingOptOuts.create({
    email: "tracked@example.com",
    domain_id: DOMAIN_ID
  });
  console.log("Created tracking opt-out:", created.data);

  // Get tracking opt-outs (up to 1000 per request)
  const page = await client.trackingOptOuts.getList();
  console.log("Tracking opt-outs:", page.data, "next cursor:", page.last_id);

  // Filter by email and creation time
  const filtered = await client.trackingOptOuts.getList({
    email: "tracked@example.com",
    start_time: "2025-01-01T00:00:00Z",
    end_time: "2025-12-31T23:59:59Z"
  });
  console.log("Filtered tracking opt-outs:", filtered.data);

  // Page through the full list, following the cursor
  const all = [...page.data];
  let cursor = page.last_id;
  while (cursor) {
    const next = await client.trackingOptOuts.getList({ last_id: cursor });
    all.push(...next.data);
    cursor = next.last_id;
  }
  console.log(`Fetched ${all.length} tracking opt-outs in total`);

  // Remove an email from the tracking opt-out list. Returns the deleted record.
  const deleted = await client.trackingOptOuts.delete(created.data.id);
  console.log("Deleted tracking opt-out:", deleted);
}

trackingOptOutsFlow().catch(console.error);
