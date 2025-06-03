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

module.exports = {
  updateAvatar,
};
