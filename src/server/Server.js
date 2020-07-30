const express = require('express'),
    Logger = require('./util/Logger'),
    Path = require('path');

class Server {
    #logger = new Logger();
    #app;

    init() {
        this.#app = express();

        this.#app.use("/media", express.static(Path.resolve(__dirname, "../public/")));
        this.#app.get("/", (req, res) =>{
            res.sendFile(Path.resolve(__dirname, "../public/index.html"));
        });

        this.start();
    }

    start() {
        this.#app.listen(3000, (port) => {
            this.#logger.info(`Listening on port 3000`);
        })
    }

    getLogger() {
        return this.#logger
    }
}

module.exports = Server;
