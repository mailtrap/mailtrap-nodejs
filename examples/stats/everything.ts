import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = 123456;

const client = new MailtrapClient({ token: TOKEN, accountId: ACCOUNT_ID });

const statsClient = client.stats;

const testGetStats = async () => {
  try {
    const result = await statsClient.get({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
    });
    console.log("Stats:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const testGetStatsWithFilters = async () => {
  try {
    const result = await statsClient.get({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
      sending_domain_ids: [1, 2],
      sending_streams: ["transactional"],
      categories: ["Welcome email"],
      email_service_providers: ["Gmail", "Yahoo"],
    });
    console.log("Filtered stats:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const testGetStatsByDomains = async () => {
  try {
    const result = await statsClient.byDomain({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
    });
    console.log("Stats by domains:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const testGetStatsByCategories = async () => {
  try {
    const result = await statsClient.byCategory({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
    });
    console.log("Stats by categories:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

const testGetStatsByEmailServiceProviders = async () => {
  try {
    const result = await statsClient.byEmailServiceProvider({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
    });
    console.log(
      "Stats by email service providers:",
      JSON.stringify(result, null, 2)
    );
  } catch (error) {
    console.error(error);
  }
};

const testGetStatsByDate = async () => {
  try {
    const result = await statsClient.byDate({
      start_date: "2026-01-01",
      end_date: "2026-01-31",
    });
    console.log("Stats by date:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  }
};

(async () => {
  try {
    await testGetStats();
    await testGetStatsWithFilters();
    await testGetStatsByDomains();
    await testGetStatsByCategories();
    await testGetStatsByEmailServiceProviders();
    await testGetStatsByDate();
  } catch (error) {
    console.error("Error running stats examples:", error);
  }
})();
