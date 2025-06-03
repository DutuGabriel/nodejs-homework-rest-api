const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/auth");
const {
  validate,
  registerSchema,
  loginSchema,
} = require("../../middlewares/validation");
const authMiddleware = require("../../middlewares/auth");

const upload = require("../../middlewares/upload");
const { updateAvatar } = require("../../controllers/users");
const { resendVerificationEmail } = require("../../controllers/users");
const { verifyEmail } = require("../../controllers/users");

router.post("/signup", validate(registerSchema), ctrl.register);

router.post("/login", validate(loginSchema), ctrl.login);

router.get("/logout", authMiddleware, ctrl.logout);

router.get("/current", authMiddleware, ctrl.getCurrent);

router.patch("/avatars", authMiddleware, upload.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", resendVerificationEmail);

module.exports = router;
