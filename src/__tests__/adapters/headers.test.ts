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

    it("converts non-string header values to strings.", () => {
      const date = new Date("2026-01-02T03:04:05Z");
      const headers = {
        mockNumber: 42,
        mockBoolean: true,
        mockDate: date,
        mockAddress: { name: "mock-name", address: "mock-email" },
        mockAddressWithoutName: { address: "mock-email" },
        mockNested: [[{ prepared: true, value: 7 }]],
      };

      const expectedResult = {
        mockNumber: "42",
        mockBoolean: "true",
        mockDate: date.toUTCString(),
        mockAddress: "mock-name <mock-email>",
        mockAddressWithoutName: "mock-email",
        mockNested: "7",
      };
      const result = adaptHeaders(headers);

      expect(result).toEqual(expectedResult);
    });

    it("skips headers with empty values.", () => {
      const headers = {
        mockNull: null,
        mockUndefined: undefined,
        mockEmptyArray: [],
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
