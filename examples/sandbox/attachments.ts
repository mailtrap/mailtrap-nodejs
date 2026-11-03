import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const SANDBOX_ID = "<YOUR-SANDBOX-ID-HERE>"
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, sandboxId: SANDBOX_ID, accountId: ACCOUNT_ID });

const sandboxesClient = client.sandbox.sandboxes
const messagesClient = client.sandbox.messages
const attachmentsClient = client.sandbox.attachments

sandboxesClient.getList()
  .then(async (sandboxes) => {
    if (sandboxes && sandboxes.length > 0) {
      const firstSandboxId = sandboxes[0].id 
      
      const messages = await messagesClient.get(firstSandboxId)
      
      if (messages && messages.length > 0) {
        const firstMessageId = messages[0].id

        const attachments = await attachmentsClient.getList(firstSandboxId, firstMessageId)

        if (attachments && attachments.length > 0) {
          const firstAttachment = attachments[0].id
          const attachmentData = await attachmentsClient.get(firstSandboxId, firstMessageId, firstAttachment)
  
          console.log(attachmentData)
        }
      }
    }
  })
