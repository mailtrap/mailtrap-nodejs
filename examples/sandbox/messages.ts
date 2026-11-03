import { MailtrapClient } from "mailtrap"

const TOKEN = "<YOUR-TOKEN-HERE>";
const ACCOUNT_ID = "<YOUR-ACCOUNT-ID-HERE>"

const client = new MailtrapClient({ token: TOKEN, accountId: ACCOUNT_ID });

const sandboxesClient = client.sandbox.sandboxes
const messagesClient = client.sandbox.messages

sandboxesClient.getList()
  .then(async (sandboxes) => {
    if (sandboxes && sandboxes.length > 0) {
      const firstSandboxId = sandboxes[0].id 

      const messages = await messagesClient.get(firstSandboxId)

      if (messages && messages.length > 0) {
        const firstMessageId = messages[0].id

        await messagesClient.getHtmlAnalysis(firstSandboxId, firstMessageId)
        await messagesClient.getHtmlMessage(firstSandboxId, firstMessageId)
        await messagesClient.getTextMessage(firstSandboxId, firstMessageId)
        await messagesClient.getMailHeaders(firstSandboxId, firstMessageId)
        await messagesClient.getMessageAsEml(firstSandboxId, firstMessageId)
        await messagesClient.getMessageHtmlSource(firstSandboxId, firstMessageId)
        await messagesClient.getRawMessage(firstSandboxId, firstMessageId)
        await messagesClient.getSpamScore(firstSandboxId, firstMessageId)
        await messagesClient.showEmailMessage(firstSandboxId, firstMessageId)
        await messagesClient.updateMessage(firstSandboxId, firstMessageId, {
          isRead: false
        })
        await messagesClient.forward(firstSandboxId, firstMessageId, 'mock@mail.com')
        const response = await messagesClient.deleteMessage(firstSandboxId, firstMessageId)

        console.log(response)
      }
    }
  })
