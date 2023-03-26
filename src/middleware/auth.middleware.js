const authMdw = (req, res, next) => {

    if (req.session?.user || req.session?.admin) {
        return next();
    }
    return res.redirect("/login");
};

module.exports = authMdw;