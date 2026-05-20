import { createHmac } from "crypto";

import verifyWebhookSignature, {
  SIGNATURE_HEX_LENGTH,
} from "../../../lib/webhooks/verify-signature";

// ---------------------------------------------------------------------------
// Cross-SDK fixture
//
// The (payload, signing_secret, expected_signature) triple below is the
// canonical fixture shared verbatim by every official Mailtrap SDK
// (mailtrap-ruby, mailtrap-python, mailtrap-php, mailtrap-nodejs,
// mailtrap-java, mailtrap-dotnet). Any change here MUST be mirrored in the
// equivalent test files in the other SDKs so the helpers stay byte-for-byte
// compatible across languages.
// ---------------------------------------------------------------------------
const FIXTURE_PAYLOAD =
  '{"event":"delivery","sending_stream":"transactional","category":"welcome","message_id":"a8b1d8f6-1f8d-4a3c-9b2e-1a2b3c4d5e6f","email":"recipient@example.com","event_id":"f1e2d3c4-b5a6-7890-1234-567890abcdef","timestamp":1716070000}';
const FIXTURE_SIGNING_SECRET = "8d9a3c0e7f5b2d4a6c1e9f8b3a7d5c2e";
const FIXTURE_EXPECTED_SIGNATURE =
  "6d262e2611cd09be1f948382b5c611d63b0e585c4c9c5e40139d6ac3876d5433";

describe("lib/webhooks/verify-signature: ", () => {
  describe("verifyWebhookSignature(): ", () => {
    // --- 1. Valid signature for given payload + secret ---------------------
    it("returns true for valid signature, payload and secret.", () => {
      expect(
        verifyWebhookSignature(
          FIXTURE_PAYLOAD,
          FIXTURE_EXPECTED_SIGNATURE,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(true);
    });

    // --- 2. Wrong secret ---------------------------------------------------
    it("returns false with a wrong signing secret.", () => {
      expect(
        verifyWebhookSignature(
          FIXTURE_PAYLOAD,
          FIXTURE_EXPECTED_SIGNATURE,
          "ffffffffffffffffffffffffffffffff"
        )
      ).toBe(false);
    });

    // --- 3. Payload tampered (one byte changed) ----------------------------
    it("returns false when the payload is tampered.", () => {
      const tampered = FIXTURE_PAYLOAD.replace("delivery", "Delivery");

      expect(
        verifyWebhookSignature(
          tampered,
          FIXTURE_EXPECTED_SIGNATURE,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(false);
    });

    // --- 4. Signature with wrong length ------------------------------------
    it("returns false without throwing when the signature is too short.", () => {
      const tooShort = FIXTURE_EXPECTED_SIGNATURE.slice(0, 31);

      expect(() =>
        verifyWebhookSignature(
          FIXTURE_PAYLOAD,
          tooShort,
          FIXTURE_SIGNING_SECRET
        )
      ).not.toThrow();

      expect(
        verifyWebhookSignature(
          FIXTURE_PAYLOAD,
          tooShort,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(false);
    });

    // --- 5. Signature with non-hex characters ------------------------------
    it("returns false without throwing for a non-hex signature.", () => {
      const notHex = "z".repeat(SIGNATURE_HEX_LENGTH);

      expect(() =>
        verifyWebhookSignature(FIXTURE_PAYLOAD, notHex, FIXTURE_SIGNING_SECRET)
      ).not.toThrow();

      expect(
        verifyWebhookSignature(FIXTURE_PAYLOAD, notHex, FIXTURE_SIGNING_SECRET)
      ).toBe(false);
    });

    // --- 6. Empty signature string -----------------------------------------
    it("returns false for an empty signature string.", () => {
      expect(
        verifyWebhookSignature(FIXTURE_PAYLOAD, "", FIXTURE_SIGNING_SECRET)
      ).toBe(false);
    });

    // --- 7. Empty signing_secret -------------------------------------------
    it("returns false for an empty signing secret.", () => {
      expect(
        verifyWebhookSignature(FIXTURE_PAYLOAD, FIXTURE_EXPECTED_SIGNATURE, "")
      ).toBe(false);
    });

    // --- 8. Empty payload + non-empty signature ----------------------------
    it("returns false for an empty payload.", () => {
      expect(
        verifyWebhookSignature(
          "",
          FIXTURE_EXPECTED_SIGNATURE,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(false);
    });

    // --- 9. Known-good cross-SDK fixture -----------------------------------
    it("matches the hardcoded HMAC-SHA256 digest for the shared fixture.", () => {
      // Recompute the digest in-place so a regression in Node's crypto module
      // or the fixture itself fails loudly: this is the byte-for-byte
      // contract every other Mailtrap SDK must satisfy.
      const computed = createHmac("sha256", FIXTURE_SIGNING_SECRET)
        .update(FIXTURE_PAYLOAD)
        .digest("hex");

      expect(computed).toBe(FIXTURE_EXPECTED_SIGNATURE);
      expect(
        verifyWebhookSignature(
          FIXTURE_PAYLOAD,
          FIXTURE_EXPECTED_SIGNATURE,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(true);
    });

    // --- Bonus: accepts a Buffer payload -----------------------------------
    it("accepts a Buffer payload equivalently to a UTF-8 string.", () => {
      expect(
        verifyWebhookSignature(
          Buffer.from(FIXTURE_PAYLOAD, "utf-8"),
          FIXTURE_EXPECTED_SIGNATURE,
          FIXTURE_SIGNING_SECRET
        )
      ).toBe(true);
    });
  });
});
