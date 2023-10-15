const express = require("express");
const route = require("./src/routes");
const DB = require("./src/common/dbConfig");
const { mongoose } = require("mongoose");
const app = express();

app.use(express.json());
app.use("/", route);

mongoose
  .connect(`${DB.dbUrl}/${DB.dbName}`)
  .then(() => {
    app.listen(8000, () => console.log("Server is listening in port 8000"));
  })
  .catch((error) => {
    console.log("Failed to connect Db", error, `${DB.dbUrl}/${DB.dbName}`);
  });
