const express = require("express");
const auth = require("../../modules/auth.js");
const knex = require("../../modules/database.js");
const crypto = require("crypto");

const router = express.Router();

router.get("/notes/", auth.express_middleware.bind(auth), (req, res) => {
    const uuid = req.eauth.user.id;
    
    const notes = knex("notes")
        .where("uuid", uuid)
        .select("id", "title", "content");

    notes.then(notes => {
        return res.json(notes);
    })
    .catch(error => {
        return res.status(500).json({ error: error });
    });
});

router.get("/notes/:id", auth.express_middleware.bind(auth), (req, res) => {
    const uuid = req.eauth.user.id;
    const id = req.params.id;

    knex("notes")
        .where("id", id)
        .andWhere("uuid", uuid)
        .select("id", "title", "content")
        .then(notes => {
            if(notes.length == 0) {
                return res.status(404).json({ error: "Note not found" });
            } else {
                return res.json(notes[0]);
            }
        })
        .catch(error => {
            return res.status(500).json({ error: error });
        });
});

module.exports = router;