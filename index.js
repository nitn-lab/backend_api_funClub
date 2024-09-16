// Creating the server using express
const express = require("express");
var cors = require('cors')
const app = express();

const routes = require("./routes/index");
const bodyParser = require("body-parser");
// require("dotenv").config();
require("./config/DataBase");
app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1", routes); //! USING API VERSION - 1

// const User = require("./models/usersModel");
// const Admin  = require("./models/adminModel");

// To start the server and listen to that port
const port = process.env.PORT || 1000; //will configure environment vairables later
app.listen(port, () => {
  console.log(`Checking if server is running ${port}`);
});

// initialising the routes
app.get("/", (req, res) => {
  res.send("<h1>First route checking</h1>");
});
