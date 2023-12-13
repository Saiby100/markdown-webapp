const crypto = require('crypto');

const hash = (password, salt) => {
    return new Promise((resolve, reject) => {
        const iterations = 10000;
        const keylen = 50;
        const digest = 'sha512';

        crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
            if (err) {
                reject(err);
            } else {
                resolve(derivedKey.toString('hex'));
            }
        });
    });
};

module.exports = {
    hash
};