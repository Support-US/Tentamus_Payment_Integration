import { Blowfish } from 'egoroof-blowfish';
const Buffer = require('buffer').Buffer;

export const BlowfishEncryption = (data, password) => {
    let plainString = data;
    // console.log("INSIDE BLOWFISH", plainString, "password", password);

    const bf = new Blowfish(password, 0, 3);
    // bf.setIv('00000000');
    // Encryption
    const encoded = bf.encode(plainString);
    const encodedText = Buffer.from(encoded).toString('hex').toUpperCase();
    console.log("ENCODED TEXT", encodedText);

    const newhex = Uint8Array.from(Buffer.from(encodedText, 'hex'));
    const decoded = bf.decode(newhex, Blowfish.TYPE.STRING);
    // console.log("DECODED TEXT", decoded);

    return encodedText;
}
