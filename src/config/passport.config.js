const passport = require("passport");
const GithubStrategy = require("passport-github2");
const userModel = require("../model/user.model");
const {GITHUB_CLIENT_ID} = require("./config.js")// variable de entorno
const {GITHUB_CLIENT_SECRET} = require("./config.js")// variable de entorno
const {GITHUB_CALLBACK_URL} = require("./config.js")// variable de entorno


const initializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: GITHUB_CALLBACK_URL ,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    console.log("PROFILE INFO ******", profile);
                    let user = await userModel.findOne({ email: profile._json?.email });
                    if (!user) {
                        let addNewUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            email: profile._json?.email,
                            age: 0,
                            password: "",
                        };
                        let newUser = await userModel.create(addNewUser);
                        done(null, newUser);
                    } else {
                        // ya existia el usuario
                        done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({ _id: id });
        done(null, user);
    });
};

module.exports = initializePassport;