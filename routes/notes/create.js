const express = require("express");
const auth = require("../../modules/auth.js");
const knex = require("../../modules/database.js");
const crypto = require("crypto");
const socket = require("../../modules/socket.js");
const logging = require("../../modules/console.js")

const router = express.Router();

router.post("/notes/", auth.express_middleware.bind(auth), (req, res) => {
    const uuid = req.eauth.user.id;
    const id = crypto.randomBytes(16).toString('hex');

    if(req.body.title && req.body.title.length > 50) {
        return res.status(400).json({ error: "Title must be less than 50 characters" });
    }

    if(req.body.content && req.body.content.length > 2000) {
        return res.status(400).json({ error: "Content must be less than 2000 characters" });
    }
    
    knex("notes").insert({
        id,
        title: req.body.title || "",
        content: req.body.content || "",
        uuid: uuid
    })
    .then(notes => {
        socket.emitToClient(uuid, "noteListUpdate", "update");
        return res.json({ success: true });
    })
    .catch(error => {
        logging.error(error);
        return res.status(500).json({ error: error });
    });
});

module.exports = router;