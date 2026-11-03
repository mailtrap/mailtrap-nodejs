import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, accountId: ACCOUNT_ID });

const accountAccessesClient = client.general.accountAccesses

accountAccessesClient.listAccountAccesses()
  .then((result) => {
    const firstResult = result[0]
    
    return accountAccessesClient.removeAccountAccess(firstResult.id)
  })
  .catch(console.error)

