import adaptHeaders from "../../adapters/headers";

describe("adapters/headers: ", () => {
  describe("adaptHeaders(): ", () => {
    it("returns flattened object in case if headers are array of key-value pairs.", () => {
      const headers = [
        {
          key: "mock-key-1",
          value: "mock-value-1",
        },
        {
          key: "mock-key-2",
          value: "mock-value-2",
        },
      ];

      const expectedResult = {
        [headers[0].key]: headers[0].value,
        [headers[1].key]: headers[1].value,
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("returns same headers object if its just `key - value`.", () => {
      const headers = {
        mockKey: "mock-value",
      };

      const result = adaptHeaders(headers);

      expect(result).toEqual(headers);
    });

    it("flattens headers object if its `key - { prepared, value }` pair.", () => {
      const headers = {
        mockKey: {
          prepared: true,
          value: "mock-value",
        },
      };

      const expectedResult = {
        mockKey: headers.mockKey.value,
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("flattens headers object if its `key - Array<values>` pair.", () => {
      const headers = {
        mockKey: ["mock-value-1", "mock-value-2"],
      };

      const expectedResult = {
        mockKey: headers.mockKey[0],
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("returns object if headers is a single `{ key, value }` pair.", () => {
      const headers = {
        key: "mock-key",
        value: "mock-value",
      };

      const expectedResult = {
        [headers.key]: headers.value,
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("reads `{ key, value }` as a pair only when both are set.", () => {
      expect(adaptHeaders({ key: "X-Custom", value: "mock-value" })).toEqual({
        "X-Custom": "mock-value",
      });
      expect(adaptHeaders({ key: "", value: "mock-value" })).toEqual({
        value: "mock-value",
      });
      expect(adaptHeaders({ key: "X-Count", value: 0 })).toEqual({
        key: "X-Count",
      });
      expect(adaptHeaders({ key: "X-Only" })).toEqual({ key: "X-Only" });
      expect(adaptHeaders({ value: "mock-value" })).toEqual({
        value: "mock-value",
      });
    });

    it("skips headers with a blank name.", () => {
      expect(adaptHeaders({ key: "   ", value: "mock-value" })).toEqual({});
      expect(
        adaptHeaders([
          { key: "X-One", value: "mock-value" },
          { key: "", value: "mock-other-value" },
        ])
      ).toEqual({ "X-One": "mock-value" });
    });

    it("converts non-string header values to strings.", () => {
      const headers = {
        mockNumber: 42,
        mockBoolean: true,
        mockAddress: { name: "mockname", address: "mock@mail.com" },
        mockAddressWithoutName: { address: "mock@mail.com" },
        mockNested: [[{ prepared: true, value: 7 }]],
      };

      const expectedResult = {
        mockNumber: "42",
        mockBoolean: "true",
        mockAddress: "mockname <mock@mail.com>",
        mockAddressWithoutName: "mock@mail.com",
        mockNested: "7",
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("quotes display names nodemailer would not leave as they are.", () => {
      const headers = {
        mockPlain: { name: "John Doe", address: "j@mail.com" },
        mockComma: { name: "Doe, John", address: "j@mail.com" },
        mockQuote: { name: 'He said "hi"', address: "j@mail.com" },
        mockBackslash: { name: "back\\slash", address: "j@mail.com" },
        mockUnicode: { name: "Ünïcode", address: "j@mail.com" },
      };

      const expectedResult = {
        mockPlain: "John Doe <j@mail.com>",
        mockComma: '"Doe, John" <j@mail.com>',
        mockQuote: '"He said \\"hi\\"" <j@mail.com>',
        mockBackslash: '"back\\\\slash" <j@mail.com>',
        mockUnicode: '"Ünïcode" <j@mail.com>',
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("replaces line breaks in header values.", () => {
      const headers = {
        mockInjection: "mock-value\r\nInjected: yes",
        mockAddress: {
          name: "Eve\r\nBcc: victim@mail.com",
          address: "j@mail.com",
        },
      };

      const expectedResult = {
        mockInjection: "mock-value Injected: yes",
        mockAddress: '"Eve Bcc: victim@mail.com" <j@mail.com>',
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("skips headers with empty values.", () => {
      const headers = {
        mockNull: null,
        mockUndefined: undefined,
        mockEmptyArray: [],
        mockFalse: false,
        mockZero: 0,
        mockBlank: "   ",
        mockDate: new Date("2026-01-02T03:04:05Z"),
        mockAddressWithoutAddress: { name: "mock-name" },
        mockAddressWithBlankAddress: { name: "mock-name", address: "  " },
        mockKey: "mock-value",
      };

      const expectedResult = {
        mockKey: "mock-value",
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });
  });
});
