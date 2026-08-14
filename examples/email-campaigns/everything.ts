import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
// ID of a verified sending domain on the account (required to create a campaign),
// as returned by the Sending Domains endpoints.
const SENDING_DOMAIN_ID = "<YOUR-SENDING-DOMAIN-ID-HERE>";

// The Email Campaigns API is token-scoped — no `accountId` is needed.
const client = new MailtrapClient({ token: TOKEN });

async function emailCampaignsFlow() {
  try {
    const scheduledAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // List campaigns (newest first). The response is a `{ data, pagination }`
    // envelope; pagination is page-token based.
    const list = await client.emailCampaigns.getList({
      per_page: 50,
      token: 1,
      search: "spring", // filter by name
    });
    console.log("Campaigns:", JSON.stringify(list.data, null, 2));
    console.log("Pagination:", JSON.stringify(list.pagination, null, 2));

    // Create a campaign. It starts in the `draft` state. Single-campaign
    // responses are wrapped in a `{ data }` envelope.
    const created = await client.emailCampaigns.create({
      name: "Spring Sale",
      domain_id: Number(SENDING_DOMAIN_ID),
      from_display_name: "Acme Marketing",
      from_local_part: "news",
      reply_to: {
        display_name: "Acme Support",
        local_part: "support",
        domain: "acme.com",
      },
      template_attributes: { subject: "Spring is here — 30% off" },
    });
    console.log("Created campaign:", JSON.stringify(created.data, null, 2));

    const campaignId = created.data.id;

    // Get a single campaign by ID.
    const one = await client.emailCampaigns.get(campaignId);
    console.log("One campaign:", JSON.stringify(one.data, null, 2));

    // Update the campaign (PATCH — only the provided fields change). The
    // template is edited in place; add the design and pick the audience via
    // contact list/segment IDs. Sending can be throttled with `gradual` mode.
    const updated = await client.emailCampaigns.update(campaignId, {
      name: "Spring Sale (updated)",
      template_attributes: {
        subject: "Hi {{first_name}}, spring is here — 30% off",
        body_html:
          '<html><body><h1>Hi {{first_name}}!</h1><p><a href="__unsubscribe_url__">Unsubscribe</a></p></body></html>',
        merge_tags: ["first_name"],
      },
      contact_list_ids: [1],
      delivery_mode: "gradual",
      delivery_options: { emails_per_hour: 1000 },
    });
    console.log("Updated campaign:", JSON.stringify(updated.data, null, 2));

    // Schedule the draft to send later. The time is reported back in
    // `current_state_metadata.scheduled_at`.
    const scheduled = await client.emailCampaigns.schedule(campaignId, {
      datetime: scheduledAt,
    });
    console.log(
      "Scheduled for:",
      scheduled.data.current_state_metadata.scheduled_at
    );

    // Cancel the scheduled send — the campaign returns to `draft`.
    // (`reset` also returns a scheduled campaign to `draft`.)
    const cancelled = await client.emailCampaigns.cancel(campaignId);
    console.log("State after cancel:", cancelled.data.current_state);

    // Start sending immediately.
    const started = await client.emailCampaigns.start(campaignId);
    console.log("State after start:", started.data.current_state);

    // Terminate the in-flight send.
    const terminated = await client.emailCampaigns.terminate(campaignId);
    console.log("State after terminate:", terminated.data.current_state);

    // Get aggregated stats for the campaign, optionally narrowed to a date
    // window via `start_date`/`end_date`. Counts and rates are all `0` until
    // the campaign has been started.
    const stats = await client.emailCampaigns.getStats(campaignId);
    console.log("Campaign stats:", JSON.stringify(stats.data, null, 2));

    // Only a campaign in the `draft` state can be deleted, and a campaign that
    // has been started can never return to `draft` — so delete a fresh draft
    // rather than the one above. Returns nothing (204 No Content).
    const throwaway = await client.emailCampaigns.create({
      name: "Draft to delete",
      domain_id: Number(SENDING_DOMAIN_ID),
      from_local_part: "news",
      template_attributes: { subject: "Draft to delete" },
    });
    await client.emailCampaigns.delete(throwaway.data.id);
    console.log("Deleted campaign:", throwaway.data.id);
  } catch (error) {
    console.error(
      "Error in emailCampaignsFlow:",
      error instanceof Error ? error.message : String(error)
    );
  }
}

emailCampaignsFlow();
