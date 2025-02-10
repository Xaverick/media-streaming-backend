const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

module.exports.connectTestDB = async () => {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.disconnect(); // Ensure no active connections before connecting
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Test Database Connected");
  }
};

module.exports.closeTestDB = async () => {
  await mongoose.disconnect(); // Ensure disconnection after tests
  if (mongoServer) {
    await mongoServer.stop();
  }
  console.log("❌ Test Database Disconnected");
};
