import { Blowfish } from 'egoroof-blowfish';
const Buffer = require('buffer').Buffer;

export const BlowfishEncryption = (data, password) => {
    let plainString = data;
    console.log("INSIDE BLOWFISH", plainString, "password", password);

    const bf = new Blowfish(password, 0, 3);
    // bf.setIv('00000000');
    // Encryption
    const encoded = bf.encode(plainString);
    const encodedText = Buffer.from(encoded).toString('hex');
    console.log("ENCODED TEXT", encodedText);

    // const newhex = Uint8Array.from(Buffer.from("0a0f436a30a54283b700ff709d4e66f25763ec2a5215916162d3016cc904dbbeb1b6d8408bd761f471d040e5e718a2da8c07df872d06ed6f04b6a122395a2dbb84cfbad5a07aba59e3c91f237bf38ddc4ff9af3e316c81a5c7857870c6644c3a", 'hex'));
    // const decoded = bf.decode(newhex, Blowfish.TYPE.STRING);
    // console.log("DECODED TEXT", decoded);

    return encodedText;
}
