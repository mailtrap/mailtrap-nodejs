import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, accountId: Number(ACCOUNT_ID) });

const projectsClient = client.sandbox.projects
const sandboxesClient = client.sandbox.sandboxes

projectsClient.getList()
  .then(async (projects) => {
    if (projects && projects.length > 0) {
      const firstProjectId = projects[0].id

      // Work on the sandbox created here, so the account's existing sandboxes stay untouched.
      const { id: sandboxId } = await sandboxesClient.create(firstProjectId, 'test-sandbox')

      const sandboxes = await sandboxesClient.getList()
      console.log(sandboxes)

      const sandboxAttributes = await sandboxesClient.getSandboxAttributes(sandboxId)
      await sandboxesClient.updateSandbox(sandboxId, {name: 'mock-name', emailUsername: 'mocker'})
      await sandboxesClient.cleanSandbox(sandboxId)
      await sandboxesClient.markAsRead(sandboxId)
      await sandboxesClient.resetCredentials(sandboxId)
      await sandboxesClient.enableEmailAddress(sandboxId)
      const response = await sandboxesClient.resetEmailAddress(sandboxId)

      console.log(response)
    }
  })
