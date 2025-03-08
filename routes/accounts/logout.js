const express = require("express");
const auth = require("../../modules/auth.js");

const router = express.Router();

router.post("/auth/logout", auth.express_middleware.bind(auth), (req, res) => {
    const [sid, tk] = req.eauth.user.token.split(".");

    auth.logout(sid)
        .then(a => {
            res.json({ success: true });
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

module.exports = router;