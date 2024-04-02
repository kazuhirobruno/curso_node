const inquirer = require("inquirer");
const chalk = require("chalk");

inquirer
  .prompt([
    {
      name: "name",
      message: "Digite o seu nome: ",
    },
    {
      name: "age",
      message: "Digite a sua idade: ",
    },
  ])
  .then((answers) => {
    const { name, age } = answers;

    if (!/^\d+$/.test(age)) {
      throw new Error("Age should be only composed by number");
    }

    console.log(
      chalk.bgYellow.black(`O seu nome é ${name} e a sua idade é ${age}`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
