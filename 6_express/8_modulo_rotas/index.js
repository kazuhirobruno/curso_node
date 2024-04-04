const express = require("express");
const app = express();
const port = 3000; // variavel ambiente

const users = require("./users");

const path = require("path");

const basePath = path.join(__dirname, "templates");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/users", users);

app.get("/", (req, res) => {
  res.sendFile(`${basePath}/index.html`);
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
