import { MailtrapClient } from "mailtrap"

/**
 * For this example, you need to have ready-to-use sending domain or,
 * a Demo domain that allows sending emails to your own account email.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 * @see https://help.mailtrap.io/article/69-sending-domain-setup#Demo-Domain--oYOU5"
 */


const TOKEN = "<YOUR-TOKEN-HERE>";
const SANDBOX_ID = "<YOUR-SANDBOX-ID-HERE>"
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const client = new MailtrapClient({ token: TOKEN, sandbox: true, sandboxId: Number(SANDBOX_ID) });

client.send({
  from: { name: "Mailtrap Test", email: SENDER_EMAIL },
  to: [{ email: RECIPIENT_EMAIL }],
  subject: "Hello from Mailtrap!",
  text: "Welcome to Mailtrap Sending!",
})
.then(console.log)
.catch(console.error);
