export default {
  ERRORS: {
    FILENAME_REQUIRED: "Filename is required.",
    CONTENT_REQUIRED: "Content is required.",
    SUBJECT_REQUIRED: "Subject is required.",
    FROM_REQUIRED: "From is required.",
    SENDING_FAILED: "Sending failed.",
    NO_DATA_ERROR: "No Data.",
    TEST_INBOX_ID_MISSING: "testInboxId is missing, testing API will not work.",
    ACCOUNT_ID_MISSING:
      "accountId is missing, please provide a valid accountId.",
    BULK_SANDBOX_INCOMPATIBLE: "Bulk mode is not applicable for sandbox API.",
  },
  CLIENT_SETTINGS: {
    SENDING_ENDPOINT: "https://send.api.mailtrap.io",
    BULK_ENDPOINT: "https://bulk.api.mailtrap.io",
    TESTING_ENDPOINT: "https://sandbox.api.mailtrap.io",
    GENERAL_ENDPOINT: "https://mailtrap.io",
    USER_AGENT:
      "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
    MAX_REDIRECTS: 0,
    TIMEOUT: 10000,
  },
  TRANSPORT_SETTINGS: {
    NAME: "MailtrapTransport",
  },
};
