const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
//const cloudinary = require("cloudinary").v2;
const cloudinary = require("../utils/config.js");
const upload = require('./multer.js')
const fs = require('fs')

const CLOUD_NAME = process.env.CLOUD_NAME;
const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.listen(8000, () => {
  console.log(`:: server is running on http://localhost8000`);
})

const Pool = require('pg').Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "class_database",
  password: "password",
  port: 5432
})


app.use("/upload", upload.array('image'), async(req, res) => {

  const uploader = async (path) => await cloudinary.uploads(path, 'images');

  if (req.method == 'POST'){
    const urls = []

    const files = req.files

    for (const file of files){
      const {path} = file

      const newPath = await uploader(path)

      urls.push(newPath)

      fs.unlinkSync(path)
    }

    res.status(200).json({
      message: 'images Uploaded Successfully',
      data: urls
    })
    console.log("success", urls);
  }else{
    res.status(405).json({
      err: "image not uploaded successfully"
    })
  }
})

/*app.post("/api/v1/class_data/upload", (req, res) => {
  const data = req.body
  const fileName = data.fileName
  let cloudinary_data = {};
  try {
    cloudinary.uploader.upload(fileName, {
      resource_type: "image"
    }).then((result) => {
      cloudinary_data = JSON.stringify(result, null, 2);
      //console.log("success", JSON.stringify(result, null, 2));
      console.log("success", cloudinary_data);
      res.status(201).send({message: "success", data: cloudinary_data});
    }).catch((error) => {
      console.log("error", JSON.stringify(error, null, 2));
    });
 
  } catch (error) {
    res.status(400).send({ message: "couldn't upload file", data: error })
    console.log(error)
  }

})*/

app.post("/api/v1/class_data", (req, res) => {
  const { level, result } = req.body;
  console.log(`the method was ${req.method}`);

  pool.query(
    "INSERT INTO class_data (level, result) VALUES ($1, $2)",
    [level, result],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(201).send({ message: { level, result } });
    }
  );
});


app.get("/api/v1/class_data", (req, res) => {
  pool.query(
    "SELECT id, level, result FROM class_data",
    [],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});


app.get("/api/v1/class_data/:id", (req, res) => {
  const { id } = req.params;

  pool.query(
    "SELECT id, level, result FROM class_data WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.status(200).json(results.rows);
    }
  );
});

app.put("/api/v1/class_data/:id", (req, res) => {
  const { id } = req.params;
  const { level, result } = req.body;

  pool.query(
    "UPDATE class_data SET level = $1, result = $2 WHERE id = $3",
    [level, result, id],
    (error, results) => {
      if (error) {
        throw error;
      }

      res.sendStatus(200);
    }
  );
});

app.delete("/api/v1/class_data/:id", (req, res) => {
  const { id } = req.params;

  pool.query("DELETE FROM class_data WHERE id = $1", [id], (error, results) => {
    if (error) {
      throw error;
    }

    res.sendStatus(200);
  });
});