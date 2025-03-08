const express = require("express");
const auth = require("../../modules/auth.js");
const knex = require("../../modules/database.js");
const crypto = require("crypto");

const router = express.Router();

router.delete("/notes/:id", auth.express_middleware.bind(auth), (req, res) => {
    const uuid = req.eauth.user.id;
    const id = req.params.id;

    knex("notes")
        .where("id", id)
        .andWhere("uuid", uuid)
        .del()
        .then(rows => {
            return res.json({ success: true });
        })
        .catch(error => {
            return res.status(500).json({ error: error });
        });
});

module.exports = router;