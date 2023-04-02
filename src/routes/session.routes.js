const { Router } = require("express");
const userModel = require("../models/user.model");
const { createHashValue, isValidPasswd } = require("../utils/encrypt");
const passport = require("passport");


const router = Router();

router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        if (!err) return res.redirect("/login");
        return res.send({ message: `logout Error`, body: err });
    });
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await userModel.findOne({ email });

        if (!usuario) {
            return res.status(401).json({ message: `este usuario no esta registrado` });
        }

        //TODO dencrypt
        const isValidPassword = await isValidPasswd(password, usuario.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: `password incorrecto` });
        }

        req.session.user = {
            ...usuario,
        };

        return res.render("products");
        /* return res.render("profile", {
            last_name: req.session?.user?.last_name || usuario.last_name,
            email: req.session?.user?.email || usuario.email,
            age: req.session?.user?.age || usuario.age,
        }); */
    } catch (error) {
        console.log(error);
    }
});

router.post("/register", async (req, res) => {
    try {

        const { first_name, last_name, email, age, password } = req.body;

        //TODO encrypt
        const passwordHashed = await createHashValue(password);

        const userAdd = { email, password, first_name, last_name, age, password: passwordHashed };
        const newUser = await userModel.create(userAdd);

        req.session.user = { email, first_name, last_name, age };
        return res.render(`login`, { user: newUser });
    } catch (error) {
        console.log(error);
    }
});

router.post("/recover-psw", async (req, res) => {
    try {

        const { new_password, email } = req.body;

        const newPswHashed = await createHashValue(new_password);
        const user = await userModel.findOne({ email });

        if (!user) {
            return res
                .status(401)
                .json({ message: `credenciales invalidas o erroneas` });
        }

        const updateUser = await userModel.findByIdAndUpdate(user._id, {
            password: newPswHashed,
        });

        if (!updateUser) {
            res.json({ message: "problemas actualizando la contrasena" });
        }

        return res.render(`login`);
    } catch (error) {
        console.log(error);
    }
});

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => { }
);

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        try {
            req.session.user = req.user;
            res.redirect("/profile");
        } catch (error) {
            console.log( error);
        }
    }
);

module.exports = router;