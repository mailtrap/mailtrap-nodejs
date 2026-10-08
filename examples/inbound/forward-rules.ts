import { MailtrapClient } from "mailtrap";

const TOKEN = "<YOUR-TOKEN-HERE>";
const INBOX_ID = Number("<YOUR-INBOX-ID-HERE>");

const client = new MailtrapClient({ token: TOKEN });
const forwardRulesClient = client.inbound.forwardRules;

async function forwardRulesFlow() {
  try {
    const created = await forwardRulesClient.create(INBOX_ID, {
      name: "Copy billing mail to finance",
      conditions: [
        {
          match_type: "sender",
          operator: "ends_with",
          value: "@billing.example.com",
        },
      ],
      destinations: [{ email: "finance@example.com" }],
    });
    console.log("Created forward rule:", created.data);

    const ruleId = created.data.id;

    console.log(
      "All forward rules:",
      await forwardRulesClient.getList(INBOX_ID)
    );
    console.log(
      "One forward rule:",
      await forwardRulesClient.get(INBOX_ID, ruleId)
    );

    const updated = await forwardRulesClient.update(INBOX_ID, ruleId, {
      destinations: [
        { email: "finance@example.com" },
        { email: "accounting@example.com" },
      ],
    });
    console.log("Updated forward rule:", updated.data);

    await forwardRulesClient.delete(INBOX_ID, ruleId);
    console.log("Deleted forward rule", ruleId);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
  }
}

forwardRulesFlow();
