import api from "../../../utils/api";

import { useState, useEffect } from "react";

import styles from "./Profile.module.css";
import formStyles from "../../form/Form.module.css";

import Input from "../../form/input";
import RoundedImage from "../../layout/RoundedImage";

import useFlashMessage from "../../../hooks/useFlashMessage";

function Profile() {
  const [user, setUser] = useState({});
  const [preview, setPreview] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token" || ""));
  const { setFlashMessage } = useFlashMessage();

  useEffect(() => {
    api
      .get("/users/checkuser", {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      });
  }, [token]);

  function handleChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  function onFileChange(e) {
    setPreview(e.target.files[0]);
    setUser({ ...user, [e.target.name]: e.target.files[0] });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let msgType = "success";

    const formData = new FormData();
    await Object.keys(user).forEach((key) => {
      formData.append(key, user[key]);
    });

    const data = await api
      .patch(`/users/edit/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => response.data)
      .catch((err) => {
        msgType = "error";
        return err.response.data;
      });

    setFlashMessage(data.message, msgType);
  }

  return (
    <section>
      <div className={styles.profile_header}>
        <h1>Perfil</h1>
        {(user.image || preview) && (
          <RoundedImage
            src={
              preview
                ? URL.createObjectURL(preview)
                : `${process.env.REACT_APP_API}/images/users/${user.image}`
            }
            alt={user.name}
          />
        )}
      </div>
      <form className={formStyles.form_container} onSubmit={handleSubmit}>
        <Input
          text="Imagem"
          type="file"
          name="image"
          handleChange={onFileChange}
        />
        <Input
          text="E-mail:"
          type="email"
          name="email"
          placeholder="Digite o seu e-mail"
          handleChange={handleChange}
          value={user.email || ""}
        />
        <Input
          text="Nome:"
          type="text"
          name="name"
          placeholder="Digite o seu nome"
          handleChange={handleChange}
          value={user.name || ""}
        />
        <Input
          text="Telefone:"
          type="number"
          name="phone"
          placeholder="Digite o seu telefone"
          handleChange={handleChange}
          value={user.phone || ""}
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
        <input type="submit" value="Editar" />
      </form>
    </section>
  );
}

export default Profile;
