import createError from "http-errors";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
import Spells from "../model/Spells.js";
dotenv.config();

export const register = async (req, res, next) => {
  const { userName, email, password } = req.body;
  console.log("hallo");
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = createError(409, "user already exists!");
      next(error);
    }
    const user = new User({
      userName,
      email,
      password,
    });
    await user.save();
    const userWithoutPassword = user.toJSON();
    return res
      .status(201)
      .json({ msg: "User created Successfully!", userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = createError(404, "email not found!");
      return next(error);
    }
    const matched = await user.comparePassword(password, user.password);
    if (!matched) {
      const error = createError(500, { msg: "password incorrect!" });
      return next(error);
    }
    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.SECRETKEY, { expiresIn: "1h" });
    console.log("🚀 ~ file: userController.js:72 ~ login ~ token:", token);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // one day
    });
    const userWithoutPassword = user.toJSON();
    console.log(userWithoutPassword);

    res
      .status(200)
      .json({ token, msg: "You are logged in 🙂 ", userWithoutPassword });
    // res.json({ msg: "you are logged in!!" });
  } catch (error) {
    console.log("2");
    console.log("🚀 ~ file: userController.js:78 ~ login ~ error:", error);
    next(createError(500, { msg: "Server Error!" }));
  }
};

export const getSpells = async (req, res) => {
  try {
    const allSpells = await Spells.find();
    res.json(allSpells);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const getUserSpells = async (req, res) => {
  try {
    const { userId } = req.user;
    const mySpells = await User.findById(userId);
    res.json(mySpells);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const addSpellToUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { spells } = await User.findById(userId).select("spells -_id");
    console.log(spells);
    if (spells.some((oneSpell)=>req.body._id === oneSpell._id)) {
      res.send("zauber ist bereits gespeichert")
    } else {
      const addSpells = await User.updateOne(
        { userId },
        {
          $push: { spells: req.body },
        }
      );
      console.log(addSpells);
    }
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const clearCookie = async (req, res) => {
  try {
    res.clearCookie("token");
    console.log("irgendwas");
    res.json({ message: "user logged out" });
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};

export const deleteSpell = async (req, res) => {
  try {
    const { userId } = req.user;
    const spell = JSON.parse(req.headers.spell);
    const deleteSpell = await User.updateOne(
      { _id: userId },
      { $pull: { spells: { _id: spell._id } } }
    );
    res.json(deleteSpell);
  } catch (error) {
    res.json(error);
    console.log(error);
  }
};
