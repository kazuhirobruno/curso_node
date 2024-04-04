const express = require("express");
const app = express();
const port = 3000; // variavel ambiente

const path = require("path");

const basePath = path.join(__dirname, "templates");

const users = require("./users");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/users", users);

//arquivos estáticos
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${basePath}/index.html`);
});

app.use(function (req, res, next) {
  res.status(404).sendFile(`${basePath}/404.html`);
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
