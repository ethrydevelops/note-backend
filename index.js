const express = require("express");
const fs = require("fs");
const path = require("path");
const logging = require("./modules/console.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.disable("x-powered-by");

app.use(express.json());
app.use(require("cors")());

function loadRoutes(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relativePath = "." + fullPath.replace(__dirname, "").replace(/\\/g, "/");
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
          loadRoutes(fullPath); // load routes in subdirectories
      } else if (file.endsWith('.js')) {
          // if its a valid route file, load it
          const route = require(fullPath);
          try {
              app.use(route);
              logging.info("Loaded route from " + relativePath);
          } catch (error) {
              logging.error("Failed to load route from " + relativePath + ": " + error);
          }
      }
  });
}

// TODO: https

app.get("/", (req, res) => {
  res.header("Content-Type", "text/plain");
  res.send("Note");
});

// start the server

async function start() {
  loadRoutes(path.join(__dirname, "routes"));

  app.listen(port, () => {
    logging.log(`Note-backend server listening on http://localhost:${port}`);
  });
}

start();