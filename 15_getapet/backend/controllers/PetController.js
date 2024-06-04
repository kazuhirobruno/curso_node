const Pet = require("../models/Pet");

const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  static async create(req, res) {
    const { name, age, weight, color } = req.body;
    const images = req.files;

    const available = true;

    //upload images

    //validation
    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    }
    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    }
    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    }
    if (images.length === 0) {
      res.status(422).json({ message: "A imagem é obrigatória!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({
        message: "Pet cadastrado com sucesso!",
        newPet,
      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  static async getAll(req, res) {
    const pets = await Pet.find().sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserPets(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "user._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getAllUserAdopts(req, res) {
    const token = getToken(req);
    const user = await getUserByToken(token);

    const pets = await Pet.find({ "adopter._id": user._id }).sort("-createdAt");

    res.status(200).json({
      pets,
    });
  }

  static async getPetById(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    res.status(200).json({
      pet,
    });
  }

  static async removePetById(req, res) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido!" });
      return;
    }

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar a sua solicitação. Tente novamente mais tarde!",
      });
      return;
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({ message: "Pet removido com sucesso" });
  }

  static async updatePet(req, res) {
    const { id } = req.params;

    const { name, age, weight, color, available } = req.body;
    const images = req.files;

    const updatedData = {};

    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar a sua solicitação. Tente novamente mais tarde!",
      });
      return;
    }

    if (!name) {
      res.status(422).json({ message: "O nome é obrigatório!" });
      return;
    } else {
      updatedData.name = name;
    }
    if (!age) {
      res.status(422).json({ message: "A idade é obrigatória!" });
      return;
    } else {
      updatedData.age = age;
    }
    if (!weight) {
      res.status(422).json({ message: "O peso é obrigatório!" });
      return;
    } else {
      updatedData.weight = weight;
    }
    if (!color) {
      res.status(422).json({ message: "A cor é obrigatória!" });
      return;
    } else {
      updatedData.color = color;
    }
    if (images.length > 0) {
      updatedData.image = [];
      images.map((image) => {
        updatedData.image.push(image.filename);
      });
    }

    await Pet.findByIdAndUpdate(id, updatedData);

    res.status(200).json({ message: "Pet atualizado com sucesso" });
  }

  static async schedule(req, res) {
    const { id } = req.params;

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    // check if user registered pet
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: "Você não pode agendar uma visita com o seu próprio pet!",
      });
      return;
    }

    // check if user has already schedule a visit
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: "Você já agendou uma visita para este Pet!",
        });
        return;
      }
    }

    // add user to pet
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: `A visita foi agendada com sucesso. Entre em contato com o ${pet.user.name} pelo telefone ${pet.user.phone}`,
    });
  }

  static async concludeAdoption(req, res) {
    const { id } = req.params;

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });

    if (!pet) {
      res.status(404).json({ message: "Pet não encontrado!" });
      return;
    }

    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({
        message:
          "Houve um problema ao processar a sua solicitação. Tente novamente mais tarde!",
      });
      return;
    }

    pet.available = false;

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: "Parabéns! O ciclo de adoção foi finalizado com sucesso",
    });
  }
};
