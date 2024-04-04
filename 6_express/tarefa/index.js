const express = require("express");
const app = express();
const port = 5000;

const path = require("path");
const basePath = path.join(__dirname, "templates");

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(express.static("public"));

app.post("/create", (req, res) => {
  const { name, password } = req.body;

  console.log(`O nome do usuário é ${name} e sua senha é ${password}`);

  res.sendFile(`${basePath}/index.html`);
});

app.get("/", (req, res) => {
  res.sendFile(`${basePath}/index.html`);
});

app.use(function (req, res, next) {
  res.status(404).sendFile(`${basePath}/404.html`);
});

app.listen(port, () => {
  console.log(`App rodando na porta ${port}`);
});
