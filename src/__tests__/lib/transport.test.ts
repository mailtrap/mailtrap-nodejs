import { readFileSync } from "fs";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import nodemailer from "nodemailer";

import mailtrapTransport from "../../lib/transport";

import config from "../../config";

const packageData = require("../../../package.json");

const { CLIENT_SETTINGS, TRANSPORT_SETTINGS } = config;
const { SENDING_ENDPOINT } = CLIENT_SETTINGS;
const { NAME } = TRANSPORT_SETTINGS;

const { version } = packageData;

describe("lib/transport: ", () => {
  describe("class MailtrapTransport: ", () => {
    it("returns function on export.", () => {
      const expectedValue = "function";

      expect(typeof mailtrapTransport).toBe(expectedValue);
    });

    it("creates object when options are passed.", () => {
      const options = {
        token: "mock-token",
      };

      const instance = mailtrapTransport(options);
      const expectedValue = "object";

      expect(typeof instance).toBe(expectedValue);
    });

    it("creates object `name`, `version` and `send` props.", () => {
      const options = {
        token: "mock-token",
      };

      const instance = mailtrapTransport(options);
      const expectedValue = "function";

      expect(instance.name).toBe(NAME);
      expect(instance.version).toBe(version);
      expect(typeof instance.send).toBe(expectedValue);
    });
  });

  describe("send(): ", () => {
    it("checks if data passed to `transport.send` method passed to callback.", () => {
      expect.assertions(2);

      const options = {
        token: "mock-token",
      };
      const transport = mailtrapTransport(options);

      const message = {
        text: "negative",
        to: {
          address: "narekgilmour@gmail.com",
          name: "mock",
        },
        from: {
          address: "anything@freelance.mailtrap.link",
          name: "Narek",
        },
        subject: "test-subject",
      };
      const initialError = "mock-value-error";
      const initalData = "mock-value-error";

      const normalizeCallback = (error: any, data: any) => {
        expect(error).toEqual(initialError);
        expect(data).toEqual(initalData);
      };

      // @ts-ignore
      message.normalize = () => normalizeCallback(initialError, initalData);

      const callback = () => {};

      // @ts-ignore
      transport.send(message, callback);
    });

    describe("attachments: ", () => {
      let mock: AxiosMockAdapter;

      beforeAll(() => {
        mock = new AxiosMockAdapter(axios);
        mock
          .onPost(`${SENDING_ENDPOINT}/api/send`)
          .reply(200, { success: true, message_ids: ["mock-message-id"] })
          .onAny()
          .reply(404);
      });

      afterEach(() => {
        mock.resetHistory();
      });

      afterAll(() => {
        mock.restore();
      });

      const sendAttachment = async (attachment: object) => {
        const transport = nodemailer.createTransport(
          mailtrapTransport({ token: "mock-token" })
        );

        await transport.sendMail({
          from: "sender@example.com",
          to: "recipient@example.com",
          subject: "mock-subject",
          text: "mock-text",
          attachments: [{ filename: "mock.txt", ...attachment }],
        });

        const [request] = mock.history.post;

        return JSON.parse(request.data).attachments[0].content;
      };

      it("sends string content encoded to base64.", async () => {
        const content = await sendAttachment({ content: "hello" });

        expect(content).toBe(Buffer.from("hello").toString("base64"));
      });

      it("sends string content with a text encoding as UTF-8.", async () => {
        const content = await sendAttachment({
          content: "héllo",
          encoding: "us-ascii",
        });

        expect(content).toBe(Buffer.from("héllo").toString("base64"));
      });

      it("sends string content with `base64` encoding as it is.", async () => {
        const content = await sendAttachment({
          content: "aGVsbG8=",
          encoding: "base64",
        });

        expect(content).toBe("aGVsbG8=");
      });

      it("sends string content with another encoding decoded.", async () => {
        const content = await sendAttachment({
          content: "68656c6c6f",
          encoding: "hex",
        });

        expect(content).toBe(Buffer.from("hello").toString("base64"));
      });

      it("sends Buffer content encoded to base64.", async () => {
        const content = await sendAttachment({ content: Buffer.from("hello") });

        expect(content).toBe(Buffer.from("hello").toString("base64"));
      });

      it("sends file content from `path` encoded to base64.", async () => {
        const content = await sendAttachment({ path: __filename });

        expect(content).toBe(readFileSync(__filename).toString("base64"));
      });
    });
  });
});
