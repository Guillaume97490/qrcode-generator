const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

mongoose.connect(process.env.MONGODB_URI ||'mongodb://localhost:27017/qrcode-gen',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  //connection established successfully
  console.log('connection established successfully')
}).catch();{
  //catch any error during the initial connection
};

module.exports = mongoose;