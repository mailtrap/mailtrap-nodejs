import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_API_KEY ?? "<YOUR-TOKEN-HERE>";

// The Email Marketing Stats API is token-scoped — no `accountId` is needed.
const client = new MailtrapClient({ token: TOKEN });

const toDateParam = (date: Date) => date.toISOString().slice(0, 10);

// The last 30 days.
const endDate = new Date();
const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
const dateRange = {
  start_date: toDateParam(startDate),
  end_date: toDateParam(endDate),
};

async function marketingStatsFlow() {
  try {
    // Campaigns and automations together. The response is a `{ data }`
    // envelope; every count and rate is `0` when nothing matched.
    const all = await client.marketingStats.get(dateRange);
    console.log("Email Marketing stats:", JSON.stringify(all.data, null, 2));

    // One source narrows the results to campaigns or to automations.
    const campaigns = await client.marketingStats.get({
      ...dateRange,
      sources: ["campaigns"],
    });
    console.log("Campaigns only:", JSON.stringify(campaigns.data, null, 2));

    // Narrow further by recipient email service provider; add
    // `sending_domain_ids` (from the Sending Domains endpoints) to pick domains.
    const automationsAtGoogle = await client.marketingStats.get({
      ...dateRange,
      sources: ["automations"],
      email_service_providers: ["Google", "Google Workspace"],
    });
    console.log(
      "Automations delivered to Google:",
      JSON.stringify(automationsAtGoogle.data, null, 2)
    );
  } catch (error) {
    console.error(
      "Error in marketingStatsFlow:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

marketingStatsFlow();
