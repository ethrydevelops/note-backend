const express = require("express");
const auth = require("../../modules/auth.js");

const router = express.Router();

router.post("/auth/login", (req, res) => {
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({ error: "Missing username or password"});
    }
    
    auth.login(req.body.username, req.body.password)
        .then(user => {
            if(user == false) {
                res.status(401).json({ error: "Invalid username or password" });
            } else {
                res.json({ success:true, token: user});
            }
        })
        .catch(error => {
            res.status(500).json({ error: error });
        });
});

module.exports = router;