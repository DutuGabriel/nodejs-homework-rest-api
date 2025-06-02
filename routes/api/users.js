const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/auth");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../../middlewares/validation");
const authMiddleware = require("../../middlewares/auth");

router.post("/signup", validate(registerSchema), ctrl.register);

router.post("/login", validate(loginSchema), ctrl.login);

router.get("/logout", authMiddleware, ctrl.logout);

router.get("/current", authMiddleware, ctrl.getCurrent);

module.exports = router;
