import crypto from "crypto";

const generatePassword = (length:any = 16) => {
    return crypto.randomBytes(length).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, length);
}

console.log(generatePassword(16));

export {generatePassword}