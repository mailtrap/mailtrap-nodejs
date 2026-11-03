import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, accountId: ACCOUNT_ID });

const billingClient = client.general.billing

const testBillingCycleUsage = async () => {
  try {
    const result = await billingClient.getCurrentBillingCycleUsage()
    console.log("Billing cycle usage:", JSON.stringify(result, null, 2))
  } catch (error) {
    console.error(error)
  }
}

testBillingCycleUsage()
