import { MailtrapClient } from "mailtrap";

/**
 * For this example, you need to have ready-to-use sending domain or,
 * a Demo domain that allows sending emails to your own account email.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SANDBOX_ID = "<YOUR-SANDBOX-ID-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const client = new MailtrapClient({ 
  token: TOKEN,
  sandbox: true,
  sandboxId: Number(SANDBOX_ID)
});

client.batchSend({
  base: {
    from: { name: "Mailtrap Test", email: SENDER_EMAIL },
    subject: "Sandbox Email",
    text: "Welcome to Mailtrap Sandbox Batch Sending!"
  },
  requests: [
    {
      to: [{ email: RECIPIENT_EMAIL }],
      custom_variables: {
        email_number: 1
      }
    },
    {
      to: [{ email: RECIPIENT_EMAIL }],
      custom_variables: {
        email_number: 2
      }
    }
  ]
})
  .then(console.log)
  .catch(console.error); 
