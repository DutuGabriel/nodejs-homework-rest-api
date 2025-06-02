require("dotenv").config();
const app = require("./app");
const connectDB = require("./db");

const start = async () => {
  await connectDB();
  app.listen(3000, () => {
    console.log("Server is running. Use our API on port: 3000");
  });
};

start();
