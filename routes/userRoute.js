import express from "express";
import {
  registerValidationRules,
  validate,
} from "../middleware/userValidation.js";

import {
  register,
  login,
  getSpells,
  getUserSpells,
  clearCookie,
  addSpellToUser,
  deleteSpell,
} from "../controller/userController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = express.Router();

router.post("/register", registerValidationRules, validate, register);
router.post("/login", login);
router.get("/spells", getSpells)
router.get("/user-spells", authenticate, getUserSpells);
router.get("/delete-cookie", clearCookie)
router.post("/addspell", authenticate, addSpellToUser)
router.delete("/delete-spell", authenticate, deleteSpell)


export default router;
