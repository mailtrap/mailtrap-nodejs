import * as http from "http";
import * as https from "https";
import axios, { AxiosInstance } from "axios";
import { Mail, SendResponse } from "./lib/types";
import encodeMailBuffers from "./lib/encodeMailBuffers";
import MailtrapError from "./lib/MailtrapError";

const MAILTRAP_ENDPOINT = "https://send.api.mailtrap.io";

export type MailtrapClientConfig = {
  endpoint?: string;
  token: string;
};

export class MailtrapClient {
  private axios: AxiosInstance;

  constructor({ endpoint = MAILTRAP_ENDPOINT, token }: MailtrapClientConfig) {
    this.axios = axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "keep-alive",
        "User-Agent":
          "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
      },
      maxRedirects: 0,
      timeout: 10000,
    });
  }

  public async send(mail: Mail): Promise<SendResponse> {
    const preparedMail = encodeMailBuffers(mail);
    try {
      const axiosResponse = await this.axios.post<SendResponse>(
        "/api/send",
        preparedMail
      );
      return axiosResponse.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverErrors =
          err.response?.data &&
          typeof err.response.data === "object" &&
          "errors" in err.response.data &&
          err.response.data.errors instanceof Array
            ? err.response.data.errors
            : undefined;

        const message = serverErrors ? serverErrors.join(", ") : err.message;

        // @ts-expect-error weird typing around Error class, but it's tested to work
        throw new MailtrapError(message, { cause: err });
      }

      // should not happen, but otherwise rethrow error as is
      throw err;
    }
  }
}

export * from "./lib/types";
