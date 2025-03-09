const express = require("express");
const auth = require("../../modules/auth.js");

const router = express.Router();

router.post("/auth/register", (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password"});
    }

    if(req.body.username.length > 20) {
        return res.status(400).json({ error: "Username must be less than 20 characters"});
    }

    if(req.body.password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters"});
    }

    auth.register(req.body.username, req.body.password)
        .then(user => {
            res.json(user);
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

module.exports = router;