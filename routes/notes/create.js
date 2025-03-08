const express = require("express");
const auth = require("../../modules/auth.js");
const knex = require("../../modules/database.js");
const crypto = require("crypto");

const router = express.Router();

router.post("/notes/", auth.express_middleware.bind(auth), (req, res) => {
    const uuid = req.eauth.user.id;
    const id = crypto.randomBytes(16).toString('hex');

    knex("notes").insert({
        id,
        title: req.body.title || "",
        content: req.body.content || "",
        uuid: uuid
    })
    .then(notes => {
        return res.json({ success: true });
    })
    .catch(error => {
        return res.status(500).json({ error: error });
    });
});

module.exports = router;