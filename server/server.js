require("./config/config");

const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(require("./routes/usuario"));

mongoose.connect(process.env.URLDB, (err, res) => {
  if (err) throw err;
  console.log(`Base de datos ONLINE`);
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando puerto ${process.env.PORT}`);
});
