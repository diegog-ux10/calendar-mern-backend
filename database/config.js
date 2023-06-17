const mongoose = require("mongoose");

const dbconnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Server Running");
  } catch (error) {
    console.log(error);
    throw new Error("Error trying to connect server");
  }
};

module.exports = {
  dbconnection,
};
