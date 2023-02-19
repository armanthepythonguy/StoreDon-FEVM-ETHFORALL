const multer = require('multer');
const express = require('express');
var cors = require('cors')
const getData = require("./getCID");
const app = express()
const port = 3500
app.use(cors())
//Configuration for Multer
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./files"); 
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `new.${ext}`);
    },
  });
const upload = multer({ storage: multerStorage });


app.post("/upload", upload.single("file"), async (req, res) => {
    res.send(await getData.getDataCID("/home/arman/hackathon/trading-engine/storage-providers/files/new.jpeg"))
});

app.get("/", async(req, res) => {
  res.send("Working !!!!")
})

app.listen(port, () => {
console.log(`app listening on port ${port}`)
})