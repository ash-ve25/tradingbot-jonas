import multer from 'multer';
import path from 'path';
// const multer = require("multer");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
// const fs = require('fs')
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     var temPath = path.join(__dirname, "../../uploads/")
//     if (!fs.existsSync(temPath)) {
//       fs.mkdirSync(temPath);
//     }
//     cb(null, temPath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.originalname.split('.').slice(0, -1).join('.')}_${getdate(new Date())}${path.extname(file.originalname)}`);
//   },
// });

// var upload = multer({
//   storage: storage
// });

// module.exports = upload;

// upload to cloudinary

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    // console.log(file)
    cb(null, `${file.originalname.split('.').slice(0, -1).join('.')}_${getdateTime()}${path.extname(file.originalname)}`);
  },
});

const uploadFile = multer({
  storage: storage,
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
  // },
});
export function getdateTime() {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    '-' +
    (currentdate.getMonth() + 1) +
    '-' +
    currentdate.getFullYear() +
    '_' +
    currentdate.getHours() +
    '-' +
    currentdate.getMinutes() +
    '-' +
    currentdate.getSeconds();
  return datetime;
}

export default uploadFile;
