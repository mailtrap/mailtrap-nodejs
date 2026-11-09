import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, accountId: Number(ACCOUNT_ID) });

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
