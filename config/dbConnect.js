const mongoose = require("mongoose")

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected Database");
  } catch (error) {
    console.log("Connect Database Error");
  }
}

module.exports = dbConnect