import { Mail, SendResponse } from "./lib/types";
export type MailtrapClientConfig = {
    endpoint?: string;
    token: string;
};
export declare class MailtrapClient {
    private axios;
    constructor({ endpoint, token }: MailtrapClientConfig);
    send(mail: Mail): Promise<SendResponse>;
}
export * from "./lib/types";
