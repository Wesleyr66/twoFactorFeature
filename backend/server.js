const express = require("express");
const app = express();
const cors = require("cors");
const twoFactorRoutes = require("./routes/twoFactorRoutes");

app.use(cors());
app.use(express.json());
app.use("/api", twoFactorRoutes);

app.listen(3000, () => {
  console.log("Servidor iniciado em http://localhost:3000");
});
app.use(express.json());
