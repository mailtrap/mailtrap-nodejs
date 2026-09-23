import adaptRecipients, {
  adaptSingleRecipient,
  adaptFirstRecipient,
} from "../../adapters/recipients";

describe("adapters/recipients: ", () => {
  describe("adaptSingleRecipient(): ", () => {
    it("builds object containing recipient email if recipient is string.", () => {
      const recipient = "mock-recipient";

      const expectedResult = {
        email: recipient,
      };
      const result = adaptSingleRecipient(recipient);

      expect(result).toEqual(expectedResult);
    });

    it("builds object containing name, email keys if recipient is Nodemailer address.", () => {
      const recipient = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = {
        name: recipient.name,
        email: recipient.address,
      };
      const result = adaptSingleRecipient(recipient);

      expect(result).toEqual(expectedResult);
    });

    it("omits name if Nodemailer address has no name.", () => {
      const expectedResult = { email: "mock-email" };

      expect(adaptSingleRecipient({ address: "mock-email" })).toEqual(
        expectedResult
      );
      expect(
        adaptSingleRecipient({ name: "   ", address: "mock-email" })
      ).toEqual(expectedResult);
    });
  });

  describe("adaptRecipients(): ", () => {
    it("returns empty array if recipients is invalid.", () => {
      const recipients = undefined;

      const expectedResult: any = [];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("wraps adapted recipient into array if it's not an array.", () => {
      const recipients = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = [
        {
          name: recipients.name,
          email: recipients.address,
        },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns adapted recipients array.", () => {
      const recipients = [
        {
          name: "mock-name-1",
          address: "mock-email-1",
        },
        {
          name: "mock-name-2",
          address: "mock-email-2",
        },
      ];

      const expectedResult = [
        {
          name: recipients[0].name,
          email: recipients[0].address,
        },
        {
          name: recipients[1].name,
          email: recipients[1].address,
        },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("flattens nested recipients arrays.", () => {
      const recipients = [
        "mock-email-1",
        [{ name: "mock-name-2", address: "mock-email-2" }, ["mock-email-3"]],
      ];

      const expectedResult = [
        { email: "mock-email-1" },
        { name: "mock-name-2", email: "mock-email-2" },
        { email: "mock-email-3" },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("keeps the address of a group that carries one.", () => {
      const recipients = {
        name: "mock-group",
        address: "mock-group@mail.com",
        group: [{ address: "mock-member@mail.com" }],
      };

      const expectedResult = [
        { name: "mock-group", email: "mock-group@mail.com" },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("skips recipients without an address.", () => {
      expect(adaptRecipients([{ name: "mock-name" }, "mock-email"])).toEqual([
        { email: "mock-email" },
      ]);
      expect(adaptRecipients({ address: "   " })).toEqual([]);
      expect(adaptRecipients({ name: "mock-group", group: [] })).toEqual([]);
    });

    it("expands address groups into their members.", () => {
      const recipients = {
        name: "mock-group",
        group: [
          { name: "mock-name-1", address: "mock-email-1" },
          { address: "mock-email-2" },
        ],
      };

      const expectedResult = [
        { name: "mock-name-1", email: "mock-email-1" },
        { email: "mock-email-2" },
      ];
      const result = adaptRecipients(recipients);

      expect(result).toEqual(expectedResult);
    });
  });

  describe("adaptFirstRecipient(): ", () => {
    it("returns undefined if recipients is invalid.", () => {
      const recipients = undefined;

      const expectedResult = undefined;
      const result = adaptFirstRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns undefined if recipients is empty array.", () => {
      const recipients: any = [];

      const expectedResult = undefined;
      const result = adaptFirstRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns adapted recipients if it's not an array.", () => {
      const recipients = {
        name: "mock-name",
        address: "mock-email",
      };

      const expectedResult = {
        name: recipients.name,
        email: recipients.address,
      };
      const result = adaptFirstRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns first adapted recipient if it's an array.", () => {
      const recipients = [
        {
          name: "mock-name-1",
          address: "mock-email-1",
        },
        {
          name: "mock-name-2",
          address: "mock-email-2",
        },
      ];

      const expectedResult = {
        name: recipients[0].name,
        email: recipients[0].address,
      };
      const result = adaptFirstRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });

    it("returns the first recipient that has an address.", () => {
      expect(
        adaptFirstRecipient([{ name: "mock-name" }, "mock-email"])
      ).toEqual({ email: "mock-email" });
      expect(adaptFirstRecipient([{ name: "mock-name" }])).toBeUndefined();
    });

    it("returns first adapted recipient if it's a nested array.", () => {
      const recipients = [[], ["mock-email-1", "mock-email-2"]];

      const expectedResult = { email: "mock-email-1" };
      const result = adaptFirstRecipient(recipients);

      expect(result).toEqual(expectedResult);
    });
  });
});
