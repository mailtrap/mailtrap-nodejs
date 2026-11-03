import warnDeprecated from "../../lib/deprecation";

describe("lib/deprecation: ", () => {
  let emitWarning: jest.SpyInstance;

  beforeEach(() => {
    emitWarning = jest
      .spyOn(process, "emitWarning")
      .mockImplementation(() => {});
  });

  afterEach(() => {
    emitWarning.mockRestore();
  });

  it("emits a DeprecationWarning naming the replacement.", () => {
    warnDeprecated("client.oldName", "client.newName");

    expect(emitWarning).toHaveBeenCalledWith(
      "client.oldName is deprecated and will be removed in a future major release; use client.newName instead.",
      { type: "DeprecationWarning", code: "MAILTRAP_DEPRECATED_NAME" }
    );
  });

  it("warns once per old name.", () => {
    warnDeprecated("client.firstName", "client.newName");
    warnDeprecated("client.firstName", "client.newName");
    warnDeprecated("client.secondName", "client.newName");

    expect(emitWarning.mock.calls.map(([message]) => message)).toEqual([
      "client.firstName is deprecated and will be removed in a future major release; use client.newName instead.",
      "client.secondName is deprecated and will be removed in a future major release; use client.newName instead.",
    ]);
  });
});
