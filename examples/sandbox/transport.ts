import { readFileSync } from "fs";
import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap"

/**
 * For this example, you need to have ready-to-use sending domain or,
 * a Demo domain that allows sending emails to your own account email.
 * @see https://help.mailtrap.io/article/69-sending-domain-setup
 */

const TOKEN = "<YOUR-TOKEN-HERE>"
const SANDBOX_ID = "<YOUR-SANDBOX-ID-HERE>"
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const transport = Nodemailer.createTransport(MailtrapTransport({
  token: TOKEN,
  sandboxId: SANDBOX_ID,
  sandbox: true
}))

transport.sendMail({
  text: "Welcome to Mailtrap Sending!",
  to: {
    address: RECIPIENT_EMAIL,
    name: "John Doe"
  },
  from: {
    address: SENDER_EMAIL,
    name: "Mailtrap Test"
  },
  subject: "Hello from Mailtrap!",
  html: `
  <!doctype html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
        <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
        <p>Inspect it using the tabs you see above and learn how this email can be improved.</p>
        <img alt="Inspect with Tabs" src="cid:welcome.png" style="width: 100%;">
        <p>Now send your email using our fake SMTP server and integration of your choice!</p>
        <p>Good luck! Hope it works.</p>
      </div>
      <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
      <style>
        .main { background-color: white; }
        a:hover { border-left-width: 1em; min-height: 2em; }
      </style>
    </body>
  </html>
`,
  attachments: [
    {
      filename: "welcome.png",
      content: readFileSync("./welcome.png"),
    },
  ],
}).then(console.log)
  .catch(console.error)
