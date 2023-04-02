const { config } = require("dotenv");

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

const {
    NODE_ENV,
    PORT,
    API_VERSION,
    ORIGIN,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,

} = process.env;

module.exports = {
    NODE_ENV,
    PORT,
    API_VERSION,
    ORIGIN,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USER,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
};