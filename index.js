const express = require("express");
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const app = express();
app.use(express.json());

const dataList = [];

app.get("/data", (req, res) => {
  res.status(200).send(dataList);
});

app.post("/data", (req, res) => {
  let data = req.body;
  dataList.push(data);
  res.status(201).send(data);
});

app.listen({ port: "8080" }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    console.log("Server is running");
  } catch (error) {
    console.error("Could not connect to the database", error);
  }
});
