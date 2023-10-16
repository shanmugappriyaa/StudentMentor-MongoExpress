const express = require("express");
const dotenv = require('dotenv')
dotenv.config()
const route = require("./src/routes");
const { mongoose } = require("mongoose");
const app = express();
const PORT = process.env.PORT

app.use(express.json());
app.use("/", route);

mongoose
  .connect(`${process.env.dbUrl}/${process.env.dbName}`)
  .then(() => {
    app.listen(8000, () => console.log("Server is listening in port 8000"));
  })
  .catch((error) => {
    console.log("Failed to connect Db", error, `${process.env.dbUrl}/${process.env.dbName}`);
  });
