const CryptoJS = require("crypto-js");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");

const config = require("./index");
const { tokenTypes } = require("../constants/mkOneViewConstants");

const jwtOptions = { secretOrKey: config.oneViewJwt.secret, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() };

const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) throw new Error("Invalid token type");

        const { sub, nonce } = payload;

        const bytes = CryptoJS.AES.decrypt(sub, config.oneViewJwt.subSecret);
        const decryptedSub = bytes.toString(CryptoJS.enc.Utf8);
        const [, , identityId, , profile, , premium_account_id, , userAccessType] = decryptedSub.split(":");

        const user = {
            premium_account_id: parseInt(premium_account_id),
            user_id: parseInt(profile),
            identityId,
            nonce,
            ...(userAccessType === "admin" && { isAdmin: true }),
        };

        done(null, user);
    } catch (error) {
        done(error, false);
    }
};

const initJwtStrategy = () => {
    try {
        const strategy = new JwtStrategy(jwtOptions, jwtVerify);
        return strategy;
    } catch (error) {
        return null;
    }
};

module.exports = { initJwtStrategy };
