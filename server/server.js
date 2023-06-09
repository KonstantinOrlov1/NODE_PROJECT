const express = require("express");
const dotEnv = require("dotenv");
const cors = require("cors");
dotEnv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", require("./routes/main.routes"));

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT + "...");
});
