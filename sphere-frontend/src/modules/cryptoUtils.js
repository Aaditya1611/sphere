import forge from 'node-forge';

// Generate RSA key pair
export const generateKeyPair = async () => {

    return new Promise((resolve, reject) => {
        forge.pki.rsa.generateKeyPair({ bits: 2048, workers: 2 }, (err, keyPair) => {
            if (err) return reject(err);

            const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
            const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);

            resolve({ publicKey, privateKey });
        });
    });
};

export const encryptPrivateKey = (privateKeyPem, password) => {
    const salt = forge.random.getBytesSync(16);

    const key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);

    const iv = forge.random.getBytesSync(12);

    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(privateKeyPem));
    cipher.finish();

    const encrypted = cipher.output.getBytes();
    const tag = cipher.mode.tag.getBytes();

    const storageObj = {
        salt: forge.util.encode64(salt),
        iv: forge.util.encode64(iv),
        tag: forge.util.encode64(tag),
        data: forge.util.encode64(encrypted)
    }

    return JSON.stringify(storageObj);
};

export const decryptPrivateKey = (encryptedJson, password) => {

    try {
        const obj = JSON.parse(encryptedJson);

        const salt = forge.util.decode64(obj.salt);
        const iv = forge.util.decode64(obj.iv);
        const tag = forge.util.decode64(obj.tag);
        const data = forge.util.decode64(obj.data);

        const key = forge.pkcs5.pbkdf2(password, salt, 10000, 32);

        const decipher = forge.cipher.createDecipher('AES-GCM', key);
        decipher.start({ iv: iv, tag: forge.util.createBuffer(tag) });
        decipher.update(forge.util.createBuffer(encrypted));
        const success = decipher.finish();

        if (success) {
            return decipher.output.toString();
        } else {
            throw new Error("Wrong password or corrupted key");
        }
    } catch (e) {
        console.error("Failed to unlock private key", e);
        return null;
    }
}
