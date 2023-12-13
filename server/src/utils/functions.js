require('dotenv').config();

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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

const generateAccessToken = (username) => {
    return jwt.sign({name: username}, process.env.SECRET_TOKEN, { expiresIn: '1800s' });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = authHeader;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;

        next();
    });
}

module.exports = {
    hash,
    generateAccessToken,
    authenticateToken
};