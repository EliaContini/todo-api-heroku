/**
 * @module server
 *
 * @author Elia Contini <https://elia.contini.page/>
 *
 * @description Solution entry point
 *
 */

require("dotenv").config();

const app = require("./app");
const database = require("./database");

const db = database(process.env.MONGODB_URI);
const server = app({
   db: db,
   logger: {
      level: "info",
   },
});

const ADDRESS = "0.0.0.0";
const PORT = process.env.PORT || 3000;

server.listen(PORT, ADDRESS, (err, address) => {
   if (err) {
      console.log(err);
      process.exit(1);
   }
});
