const mongoose = require("mongoose");

const connecttoDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDb Connected ${conn.connection.host}`.yellow.underline);
  } catch (error) {
    console.log(`Error
        : ${error.message}`.red.bold);
    process.exit();
  }
};

module.exports=connecttoDb