const { request, response } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");

const createUser = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "An user already exist with that email",
      });
    }
    user = new User(req.body);
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);
    await user.save();
    const token = await generateJWT(user.id, user.name);
    res.status(201).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to Admin",
    });
  }
};

const userLogin = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const hasPass = user.password;
    console.log(hasPass);

    if (!user) {
      return res.status(400).json({
        ok: false,
        msg: "Email is not correct",
      });
    }

    const validPassword = bcrypt.compareSync(password, hasPass);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrect",
      });
    }
    const token = await generateJWT(user.id, user.name);
    res.status(200).json({
      ok: true,
      uid: user.id,
      name: user.name,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to Admin",
    });
  }
};

const revalidateToken = async (req, res) => {
  const uid = req.uid;
  const name = req.name;
  const token = await generateJWT(uid, name);
  res.json({
    ok: true,
    token,
    uid,
    name,
  });
};

module.exports = { createUser, userLogin, revalidateToken };
