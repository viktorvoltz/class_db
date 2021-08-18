const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(8000, () => {
    console.log(`server is running.`);
})

const Pool = require('pg').Pool;
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "class_database",
    password: "password",
    port: 5432
})

app.post("/api/v1/class_data", (req, res) => {
    const {level, result} = req.body;

    pool.query(
        "INSERT INTO class_data (level, result) VALUES ($1, $2)",
        [level, result],
        (error, results) => {
            if (error){
                throw error;
            }

            res.sendStatus(201);
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