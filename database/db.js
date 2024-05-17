const mongoose = require("mongoose");
const mongoURL = process.env.MONGO_URL;

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });
