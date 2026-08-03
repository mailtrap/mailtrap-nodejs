import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const TEST_INBOX_ID = "<YOUR-TEST-INBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, testInboxId: TEST_INBOX_ID, accountId: ACCOUNT_ID });

const permissionsClient = client.general.permissions

permissionsClient.getResources()
  .then((result) => {
    const firstResult = result[0]
    console.log(firstResult)

    return permissionsClient.bulkPermissionsUpdate(5142, [
      {resourceId: '3281', resourceType: 'account', accessLevel: 'viewer'},
      {resourceId: '3809', resourceType: 'inbox', destroy: true}
    ])
  })
