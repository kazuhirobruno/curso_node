import { useState, useContext } from "react";

import Input from "../../form/input";
import { Link } from "react-router-dom";

import styles from "../../form/Form.module.css";

import { Context } from "../../../context/UserContext";

function Register() {
  const [user, setUser] = useState({});
  const { register } = useContext(Context);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    register(user);
  }

  return (
    <section className={styles.form_container}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <Input
          text="Nome:"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleChange={handleChange}
        />
        <Input
          text="Telefone:"
          type="number"
          name="phone"
          placeholder="Digite o seu telefone"
          handleChange={handleChange}
        />
        <Input
          text="E-mail:"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleChange={handleChange}
        />
        <Input
          text="Senha:"
          type="password"
          name="password"
          placeholder="Digite a sua senha"
          handleChange={handleChange}
        />
        <Input
          text="Confirmação de senha:"
          type="password"
          name="confirmpassword"
          placeholder="Confirme a sua senha"
          handleChange={handleChange}
        />
        <input type="submit" value="Cadastrar" />
      </form>
      <p>
        Já tem conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </section>
  );
}

export default Register;
