const express = require("express");
const exphbs = require("express-handlebars");

const app = express();

const hbs = exphbs.create({
  partialsDir: ["views/partials"],
});

const products = [
  {
    name: "Geladeira",
    price: "1.500,00",
    oldPrice: "2.000,00",
    link: "/product/geladeira",
    promotional: true,
  },
  {
    name: "Fogão",
    price: "550,00",
    link: "/product/fogao",
    promotional: false,
  },
  {
    name: "Lavadora",
    price: "1.200,00",
    oldPrice: "1.500,00",
    link: "/product/lavadora",
    promotional: true,
  },
  {
    name: "Liquidificador",
    price: "300,00",
    link: "/product/liquidificador",
    promotional: false,
  },
  {
    name: "Chave",
    price: "50,00",
    oldPrice: "75,00",
    link: "/product/chave",
    promotional: true,
  },
];

const findProduct = (name) => {
  const answer = products.filter((item) => {
    return item.link === `/product/${name}`;
  });

  if (answer.length > 0) {
    return answer[0];
  }

  return null;
};

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.get("/product/:name", (req, res) => {
  const { name } = req.params;
  const product = findProduct(name);

  if (product) {
    res.render("product", { product });
  } else {
    res.status(404).render("404");
  }
});

app.get("/", (req, res) => {
  res.render("home", { products });
});

app.use(function (req, res, next) {
  res.status(404).render("404");
});

app.listen(3000, () => {
  console.log("App funcionando!");
});
