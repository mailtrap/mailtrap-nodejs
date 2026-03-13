# Mailtrap Node.js client - Official

![TypeScript](https://img.shields.io/npm/types/mailtrap?logo=typescript&logoColor=white&label=%20)
[![test](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml/badge.svg)](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml)
[![NPM](https://shields.io/npm/v/mailtrap?logo=npm&logoColor=white)](https://www.npmjs.com/package/mailtrap)
[![downloads](https://shields.io/npm/d18m/mailtrap)](https://www.npmjs.com/package/mailtrap)

## Prerequisites

To get the most out of this official Mailtrap.io Node.js SDK:

- [Create a Mailtrap account](https://mailtrap.io/signup)

- [Verify your domain](https://mailtrap.io/sending/domains)

## Installation

You can install the package via [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/):

```bash
npm install mailtrap

# or, if you are using Yarn:
yarn add mailtrap
```

## Usage

You should use ES modules or CommonJS imports in your application to load the package.

### Minimal usage (Transactional sending)

The quickest way to send a single transactional email with only the required parameters:

```ts
import { MailtrapClient } from "mailtrap";

const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY, // You can create your API key here https://mailtrap.io/api-tokens
});

mailtrap
  .send({
    from: { name: "Mailtrap Test", email: "sender@example.com" },
    to: [{ email: "recipient@example.com" }],
    subject: "Hello from Mailtrap Node.js",
    text: "Plain text body",
  })
  .then(console.log)
  .catch(console.error);
```

### Sandbox vs Production (easy switching)

Mailtrap lets you test safely in the Email Sandbox and then switch to Production (Sending) with one flag.

Example `.env` variables (or export in shell):

```bash
MAILTRAP_API_KEY=your_api_token # https://mailtrap.io/api-tokens
MAILTRAP_USE_SANDBOX=true       # true/false toggle
MAILTRAP_INBOX_ID=123456        # Only needed for sandbox
```

Bootstrap logic:

```ts
import { MailtrapClient } from "mailtrap";

const apiKey = process.env.MAILTRAP_API_KEY;
const isSandbox = process.env.MAILTRAP_USE_SANDBOX === "true";
const inboxId = isSandbox ? Number(process.env.MAILTRAP_INBOX_ID) : undefined; // required only for sandbox

const client = new MailtrapClient({
  token: apiKey,
  sandbox: isSandbox,
  testInboxId: inboxId, // undefined is ignored for production
});

client
  .send({
    from: {
      name: "Mailtrap Test",
      email: isSandbox ? "sandbox@example.com" : "no-reply@your-domain.com",
    },
    to: [{ email: "recipient@example.com" }],
    subject: isSandbox ? "[SANDBOX] Demo email" : "Welcome onboard",
    text: "This is a minimal body for demonstration purposes.",
  })
  .then(console.log)
  .catch(console.error);
```

Bulk stream example (optional) differs only by setting `bulk: true`:

```ts
const bulkClient = new MailtrapClient({ token: apiKey, bulk: true });
```

Recommendations:

- Toggle sandbox with `MAILTRAP_USE_SANDBOX`.

- Use separate API tokens for Production and Sandbox.

- Keep initialisation in a single factory object/service so that switching is centralised.

### Full-featured usage example

```ts
import { MailtrapClient } from "mailtrap";
import fs from "node:fs";
import path from "node:path";

// Init Mailtrap client depending on your needs
const mailtrap = new MailtrapClient({
  token: process.env.MAILTRAP_API_KEY, // your API token
  bulk: false, // set to true for bulk email sending (false by default)
  sandbox: false, // set to true for sandbox mode (false by default)
  testInboxId: undefined, // optional, only for sandbox mode
});

const welcomeImage = fs.readFileSync(path.join(__dirname, "welcome.png"));

mailtrap
  .send({
    category: "Integration Test",
    custom_variables: {
      user_id: "45982",
      batch_id: "PSJ-12",
    },
    from: { name: "Mailtrap Test", email: "example@your-domain-here.com" },
    reply_to: { email: "reply@your-domain-here.com" },
    to: [{ name: "Jon", email: "email@example.com" }],
    cc: [{ email: "mailtrapqa@example.com" }, { email: "staging@example.com" }],
    bcc: [{ email: "mailtrapdev@example.com" }],
    subject: "Best practices of building HTML emails",
    text: "Hey! Learn the best practices of building HTML emails and play with ready-to-go templates. Mailtrap's Guide on How to Build HTML Email is live on our blog",
    html: `
      <html>
        <body>
          <p><br>Hey</br>
          Learn the best practices of building HTML emails and play with ready-to-go templates.</p>
          <p><a href="https://mailtrap.io/blog/build-html-email/">Mailtrap's Guide on How to Build HTML Email</a> is live on our blog</p>
          <img src="cid:welcome.png">
        </body>
      </html>
    `,
    attachments: [
      {
        filename: "welcome.png",
        content_id: "welcome.png",
        disposition: "inline",
        content: welcomeImage,
      },
    ],
    headers: {
      "X-Message-Source": "domain.com",
      "X-Mailer": "Mailtrap Node.js Client",
    },
  })
  .then(console.log)
  .catch(console.error);

// OR Template email sending
mailtrap
  .send({
    from: { name: "Mailtrap Test", email: "example@your-domain-here.com" },
    reply_to: { email: "reply@your-domain-here.com" },
    to: [{ name: "Jon", email: "example@gmail.com" }],
    template_uuid: "bfa432fd-0000-0000-0000-8493da283a69",
    template_variables: {
      user_name: "Jon Bush",
      next_step_link: "https://mailtrap.io/",
      get_started_link: "https://mailtrap.io/",
      onboarding_video_link: "some_video_link",
      company: {
        name: "Best Company",
        address: "Its Address",
      },
      products: [
        {
          name: "Product 1",
          price: 100,
        },
        {
          name: "Product 2",
          price: 200,
        },
      ],
      isBool: true,
      int: 123,
    },
  })
  .then(console.log)
  .catch(console.error);
```

## Nodemailer Transport

> NOTE: [Nodemailer](https://www.npmjs.com/package/nodemailer) is needed as a dependency.

```sh
npm install nodemailer

# or, if you are using Yarn:
yarn add nodemailer
```

If you're using TypeScript, install `@types/nodemailer` as a `devDependency`:

```sh
npm install -D @types/nodemailer

# or, if you are using Yarn:
yarn add --dev @types/nodemailer
```

You can provide Mailtrap-specific keys like `category`, `custom_variables`, `template_uuid`, and `template_variables`.

See transport usage below:

- [Transport](examples/sending/transport.ts)

## Supported functionality & Examples

Email API:

- Send an email (Transactional stream) – [`sending/minimal.ts`](examples/sending/minimal.ts)
- Send an email (Bulk stream) – [`bulk/send-mail.ts`](examples/bulk/send-mail.ts)
- Send an email with a Template (Transactional) – [`sending/template.ts`](examples/sending/template.ts)
- Send an email with a Template (Bulk) – [`bulk/send-mail.ts`](examples/bulk/send-mail.ts)
- Batch send (Transactional) – [`batch/transactional.ts`](examples/batch/transactional.ts)
- Batch send (Bulk) – [`batch/bulk.ts`](examples/bulk/bulk.ts)
- Batch send with Template (Transactional) – [`batch/template.ts`](examples/batch/template.ts)
- Batch send with Template (Bulk) – [`batch/template.ts`](examples/batch/template.ts)
- Sending domain management CRUD – [`sending-domains/everything.ts`](examples/sending-domains/everything.ts)
- Sending stats (aggregated and by domain, category, ESP, date) – [`stats/everything.ts`](examples/stats/everything.ts)
- Email logs (list with filters, get by message ID) – [`email-logs/everything.ts`](examples/email-logs/everything.ts)

Email Sandbox (Testing):

- Send an email (Sandbox) – [`testing/send-mail.ts`](examples/testing/send-mail.ts)
- Send an email with a Template (Sandbox) – [`testing/template.ts`](examples/testing/template.ts)
- Batch send (Sandbox) – [`batch/sandbox.ts`](examples/batch/sandbox.ts)
- Batch send with Template (Sandbox) – [`batch/sandbox.ts`](examples/batch/sandbox.ts)
- Message management CRUD – [`testing/messages.ts`](examples/testing/messages.ts)
- Inbox management CRUD – [`testing/inboxes.ts`](examples/testing/inboxes.ts)
- Project management CRUD – [`testing/projects.ts`](examples/testing/projects.ts)
- Attachments operations – [`testing/attachments.ts`](examples/testing/attachments.ts)

Contact management:

- Contacts CRUD & listing – [`contacts/everything.ts`](examples/contacts/everything.ts)
- Contact lists CRUD – [`contact-lists/everything.ts`](examples/contact-lists/everything.ts)
- Custom fields CRUD – [`contact-fields/everything.ts`](examples/contact-fields/everything.ts)
- Import/Export – [`contact-imports/everything.ts`](examples/contact-imports/everything.ts), [`contact-exports/everything.ts`](examples/contact-exports/everything.ts)
- Events – [`contact-events/everything.ts`](examples/contact-events/everything.ts)

General API:

- Templates CRUD – [`templates/everything.ts`](examples/templates/everything.ts)
- Suppressions (find & delete) – [`sending/suppressions.ts`](examples/sending/suppressions.ts)
- Billing info – [`general/billing.ts`](examples/general/billing.ts)
- Accounts info – [`general/accounts.ts`](examples/general/accounts.ts)
- Permissions listing – [`general/permissions.ts`](examples/general/permissions.ts)
- Users listing – [`general/account-accesses.ts`](examples/general/account-accesses.ts)

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/railsware/mailtrap-nodejs). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Mailtrap project's codebases, issue trackers, chat rooms, and mailing lists is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Compatibility with previous releases

Versions of this package up to 2.0.2 were an [unofficial client](https://github.com/vchin/mailtrap-client) developed by [@vchin](https://github.com/vchin). Package version 3 is a completely new package. 

