import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";

// Listing accounts does not need an accountId, so you can use it to find yours.
const client = new MailtrapClient({ token: TOKEN });

const accountsClient = client.general.accounts

accountsClient.getAllAccounts()
  .then(console.log)
  .catch(console.error)
