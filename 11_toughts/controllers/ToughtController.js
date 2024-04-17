const Tought = require("../models/Tought");
const User = require("../models/User");

const { Op } = require("sequelize");

module.exports = class ToughtController {
  static async showToughts(req, res) {
    let search = "";

    if (req.query.search) {
      search = req.query.search;
    }

    let order = "DESC";

    if (req.query.order === "old") {
      order = "ASC";
    } else {
      order = "DESC";
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: { title: { [Op.like]: `%${search}%` } },
      order: [["createdAt", order]],
    });
    const toughts = toughtsData.map((result) => result.get({ plain: true }));

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }
    res.render("toughts/home", { toughts, search, toughtsQty });
  }

  static async dashboard(req, res) {
    const userId = req.session.userid;

    const user = await User.findOne({
      where: { id: userId },
      include: Tought,
      pain: true,
    });

    if (!user) {
      res.redirect("/login");
    }

    const toughts = user.Toughts.map((result) => result.dataValues);

    const emptyToughts = toughts.length === 0 ? true : false;

    res.render("toughts/dashboard", { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render("toughts/create");
  }

  static async createToughtSave(req, res) {
    const tought = {
      title: req.body.title,
      UserId: req.session.userid,
    };

    try {
      await Tought.create(tought);
      req.flash("message", "Pensamento criado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async removeTought(req, res) {
    const { id } = req.body;
    const UserId = req.session.userid;

    try {
      await Tought.destroy({ where: { id, userid: UserId } });
      req.flash("message", "Pensamento removido com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }

  static async updateTought(req, res) {
    const { id } = req.params;

    const tought = await Tought.findOne({ where: { id }, raw: true });
    res.render("toughts/edit", { tought });
  }

  static async updateToughtSave(req, res) {
    console.log(req);
    const { id } = req.body;
    const tought = {
      title: req.body.title,
    };
    try {
      await Tought.update(tought, { where: { id } });
      req.flash("message", "Pensamento atualizado com sucesso!");
      req.session.save(() => {
        res.redirect("/toughts/dashboard");
      });
    } catch (err) {
      console.log(err);
    }
  }
};
