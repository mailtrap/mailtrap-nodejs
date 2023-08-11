"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function encodeMailBuffers(mail) {
    const preparedMail = { ...mail };
    if ("text" in preparedMail && preparedMail.text instanceof Buffer) {
        preparedMail.text = preparedMail.text.toString();
    }
    if ("html" in preparedMail && preparedMail.html instanceof Buffer) {
        preparedMail.html = preparedMail.html.toString();
    }
    if (preparedMail.attachments) {
        preparedMail.attachments = preparedMail.attachments.map((attachment) => {
            if (attachment.content instanceof Buffer) {
                return {
                    ...attachment,
                    content: attachment.content.toString("base64"),
                };
            }
            return attachment;
        });
    }
    return preparedMail;
}
exports.default = encodeMailBuffers;
