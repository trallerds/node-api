const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    require: true,
    rejectUnauthorize: false,
  },
});

const SensorData = sequelize.define("sensor-data", {
  serial: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
});

const app = express();

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(limiter);

//authorization
app.use((req, res, next) => {
  let key = req.query.key;
  if (!key || key !== "12345") {
    res.status(403).send();
    return;
  }
  next();
});

app.get("/data", async (req, res) => {
  let limit = req.query.limit || 5;
  let offset = req.query.offset || 0;
  const allData = await SensorData.findAll({ limit, offset });
  res.status(200).send(allData);
});

app.post("/data", async (req, res) => {
  let data = req.body;
  const sensorData = await SensorData.create(data);
  res.status(201).send(sensorData);
});

app.listen({ port: "8080" }, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to database");
    sequelize.sync({ alter: true });
    console.log("Sync to database");
  } catch (error) {
    console.error("Could not connect to the database", error);
  }
  console.log("Server is running");
});
