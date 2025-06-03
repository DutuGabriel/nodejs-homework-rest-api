const fs = require("fs/promises");
const path = require("path");
const jimp = require("jimp");
const User = require("../models/user");

const avatarsDir = path.join(__dirname, "../public/avatars");

const updateAvatar = async (req, res) => {
  const { path: tempPath, originalname } = req.file;
  const { _id } = req.user;
  const ext = path.extname(originalname);
  const filename = `${_id}${ext}`;
  const finalPath = path.join(avatarsDir, filename);

  try {
    const image = await jimp.read(tempPath);
    await image.resize(250, 250).writeAsync(tempPath);

    await fs.rename(tempPath, finalPath);

    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempPath);
    res.status(500).json({ message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.verificationToken = null;
  user.verify = true;
  await user.save();

  res.status(200).json({ message: "Verification successful" });
};

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "missing required field email" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: "Verification has already been passed" });
  }

  const verifyLink = `${process.env.BASE_URL}/api/users/verify/${user.verificationToken}`;

  await sgMail.send({
    to: email,
    from: "gdutu94@gmail.com",
    subject: "Verify your email again",
    html: `<a href="${verifyLink}">Click to verify your email</a>`,
  });

  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  updateAvatar,
  verifyEmail,
  resendVerificationEmail,
};
