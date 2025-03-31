"use client";
const generatePassword = (length:any = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    
    return Array.from(array, byte => chars[byte % chars.length]).join('');
}

console.log(generatePassword(16));

export {generatePassword}