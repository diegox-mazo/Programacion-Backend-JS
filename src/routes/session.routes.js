const { Router } = require("express");
const userModel = require("../models/user.model");

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
            return res.json({ message: `este usuario no esta registrado` });
        }

        if (usuario.password !== password) {
            return res.json({ message: `password incorrecto` });
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

        const userAdd = { email, password, first_name, last_name, age, password };
        const newUser = await userModel.create(userAdd);

        req.session.user = { email, first_name, last_name, age };
        return res.render(`login`,{user: newUser} );
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;