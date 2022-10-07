import * as http from "http";
import * as https from "https";
import axios, { AxiosInstance, AxiosError } from "axios";
import { MailtrapClientConfig, Mail, SendResponse } from "./lib/types";
import encodeMailBuffers from "./lib/encodeMailBuffers";

const MAILTRAP_ENDPOINT = "https://send.api.mailtrap.io";

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
      if (err instanceof AxiosError) {
        const unwrappedError = err.response?.data ?? {
          success: false,
          error: ["connection failed"],
        };
        throw unwrappedError;
      }
      // should not happen, but otherwise rethrow error as is
      throw err;
    }
  }
}

export * from "./lib/types";
