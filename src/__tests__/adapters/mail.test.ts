import adaptMail from "../../adapters/mail";

import config from "../../config";
import {
  adaptSingleRecipient,
  adaptFirstRecipient,
} from "../../adapters/recipients";

const { ERRORS } = config;
const { SUBJECT_REQUIRED, FROM_REQUIRED } = ERRORS;

describe("adapters/mail: ", () => {
  describe("adaptMail(): ", () => {
    it("returns object with error `from is required`.", () => {
      const data = {};

      const expectedResult = { success: false, errors: [FROM_REQUIRED] };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers.", () => {
      const data = {
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        subject: "mock-subject",
        replyTo: "mock-reply-to",
      };

      const expectedResult = {
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        subject: data.subject,
        reply_to: adaptFirstRecipient(data.replyTo),
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + attachments.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        replyTo: [],
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        attachments: data.attachments,
        reply_to: adaptFirstRecipient(data.replyTo),
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + attachments + custom variables.", () => {
      const data = {
        subject: "mock-subject",
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        customVariables: {
          user_id: "mock-user_id",
        },
        replyTo: ["mock-reply-to"],
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        attachments: data.attachments,
        custom_variables: data.customVariables,
        reply_to: adaptFirstRecipient(data.replyTo),
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + attachments + custom variables + template_uuid.", () => {
      const data = {
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        customVariables: {
          user_id: "mock-user_id",
        },
        templateUuid: "mock-templateUuid",
      };

      const expectedResult = {
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        attachments: [
          {
            filename: data.attachments[0].filename,
            content: data.attachments[0].content,
            disposition: undefined,
            content_id: undefined,
            type: undefined,
          },
        ],
        custom_variables: data.customVariables,
        template_uuid: data.templateUuid,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
      expect(result).not.toHaveProperty("template_variables");
    });

    it("returns `mail` object with basic info + headers + attachments + custom variables + template_uuid + template_variables.", () => {
      const data = {
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        customVariables: {
          user_id: "mock-user_id",
        },
        templateUuid: "mock-templateUuid",
        templateVariables: {
          user_email: "mock user email",
        },
      };

      const expectedResult = {
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        headers: data.headers,
        attachments: [
          {
            filename: data.attachments[0].filename,
            content: data.attachments[0].content,
            disposition: undefined,
            content_id: undefined,
            type: undefined,
          },
        ],
        custom_variables: data.customVariables,
        template_uuid: data.templateUuid,
        template_variables: data.templateVariables,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns object with error `subject is required`.", () => {
      const data = {
        from: "mock-from",
        headers: {
          mockKey: "mock-value",
        },
        attachments: [{ filename: "mock-filename", content: "mock-content" }],
        customVariables: {
          user_id: "mock-user_id",
        },
      };

      const expectedResult = { success: false, errors: [SUBJECT_REQUIRED] };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + category.", () => {
      const data = {
        from: "mock-from",
        customVariables: {
          user_id: "mock-user_id",
        },
        subject: "mock-subject",
        category: "mock-category",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        category: data.category,
        custom_variables: data.customVariables,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + category + text.", () => {
      const data = {
        from: "mock-from",
        customVariables: {
          user_id: "mock-user_id",
        },
        subject: "mock-subject",
        category: "mock-category",
        text: "mock-text",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        category: data.category,
        custom_variables: data.customVariables,
        text: data.text,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + html.", () => {
      const data = {
        from: "mock-from",
        customVariables: {
          user_id: "mock-user_id",
        },
        subject: "mock-subject",
        category: "mock-category",
        html: "mock-html",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        category: data.category,
        custom_variables: data.customVariables,
        html: data.html,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });

    it("returns `mail` object with basic info + headers + text + html.", () => {
      const data = {
        from: "mock-from",
        customVariables: {
          user_id: "mock-user_id",
        },
        subject: "mock-subject",
        category: "mock-category",
        html: "mock-html",
        text: "mock-text",
      };

      const expectedResult = {
        subject: data.subject,
        from: adaptSingleRecipient(data.from),
        to: [],
        cc: [],
        bcc: [],
        category: data.category,
        custom_variables: data.customVariables,
        html: data.html,
        text: data.text,
      };
      const result = adaptMail(data);

      expect(result).toEqual(expectedResult);
    });
  });
});
