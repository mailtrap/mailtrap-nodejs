"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailtrapClient = void 0;
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const axios_1 = __importDefault(require("axios"));
const encodeMailBuffers_1 = __importDefault(require("./lib/encodeMailBuffers"));
const MailtrapError_1 = __importDefault(require("./lib/MailtrapError"));
const MAILTRAP_ENDPOINT = "https://send.api.mailtrap.io";
class MailtrapClient {
    constructor({ endpoint = MAILTRAP_ENDPOINT, token }) {
        this.axios = axios_1.default.create({
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
            baseURL: endpoint,
            headers: {
                Authorization: `Bearer ${token}`,
                Connection: "keep-alive",
                "User-Agent": "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
            },
            maxRedirects: 0,
            timeout: 10000,
        });
    }
    async send(mail) {
        const preparedMail = (0, encodeMailBuffers_1.default)(mail);
        try {
            const axiosResponse = await this.axios.post("/api/send", preparedMail);
            return axiosResponse.data;
        }
        catch (err) {
            if (axios_1.default.isAxiosError(err)) {
                const serverErrors = err.response?.data &&
                    typeof err.response.data === "object" &&
                    "errors" in err.response.data &&
                    err.response.data.errors instanceof Array
                    ? err.response.data.errors
                    : undefined;
                const message = serverErrors ? serverErrors.join(", ") : err.message;
                // @ts-expect-error weird typing around Error class, but it's tested to work
                throw new MailtrapError_1.default(message, { cause: err });
            }
            // should not happen, but otherwise rethrow error as is
            throw err;
        }
    }
}
exports.MailtrapClient = MailtrapClient;
__exportStar(require("./lib/types"), exports);
