import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const SANDBOX_ID = "<YOUR-SANDBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, sandboxId: SANDBOX_ID, accountId: ACCOUNT_ID });

const projectsClient = client.sandbox.projects
const sandboxesClient = client.sandbox.sandboxes

projectsClient.getList()
  .then(async (projects) => {
    if (projects && projects.length > 0) {
      const firstProjectId = projects[0].id

      await sandboxesClient.create(firstProjectId, 'test-sandbox')

      const sandboxes = await sandboxesClient.getList()

      if (sandboxes && sandboxes.length > 0) {
        const firstSandboxId = sandboxes[0].id

        const sandboxAttributes = await sandboxesClient.getSandboxAttributes(firstSandboxId)
        await sandboxesClient.updateSandbox(firstSandboxId, {name: 'mock-name', emailUsername: 'mocker'})
        await sandboxesClient.cleanSandbox(firstSandboxId)
        await sandboxesClient.markAsRead(firstSandboxId)
        await sandboxesClient.resetCredentials(firstSandboxId)
        await sandboxesClient.enableEmailAddress(firstSandboxId)
        const response = await sandboxesClient.resetEmailAddress(firstSandboxId)
        
        console.log(response)
      }
    }
  })
