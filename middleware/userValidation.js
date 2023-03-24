import { body, validationResult } from "express-validator";
import createError from "http-errors";
import { UserSchema } from "../model/User.js";

const requiredFields = UserSchema.requiredPaths();

const requiredFieldsValidation = requiredFields.map((field) => {
  return body(field).exists().withMessage(`${field} is required`);
});

export const registerValidationRules = [
  ...requiredFieldsValidation,
  body("userName")
    .isLength({ min: 3 })
    .withMessage(`UserName must be at least 3 characters long`),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("you have to enter a valid Email !!!"),
  body("password").isString().withMessage("password must be a stirng"),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const error = createError(400, { errors: errors.array() });
  next(error);
};
