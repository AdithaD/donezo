import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/db";

import task from "./routes/task";
import list from "./routes/list";

import logging from "./utils/logging";
import cors from "cors";

const port = 8080;

const server = express();
server.use(express.json());
server.use(cors());
server.use(logging);

const v1 = express.Router();

v1.use("/task", task);
v1.use("/list", list);
server.use("/api/v1", v1);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
