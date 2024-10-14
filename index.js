const express = require("express");

const app = express();
app.use(express.json());

const dataList = [];

app.get("/data", (req, res) => {
  res.status(200).send(dataList);
  return;
});

app.post("/data", (req, res) => {
  let data = req.body;
  dataList.push(data);
  res.status(201).send(data);
  return;
});

app.listen({ port: "8080" }, () => {
  console.log("Server is running");
});
