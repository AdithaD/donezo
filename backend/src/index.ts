import express from "express";
import dotenv from "dotenv";
dotenv.config();
import "./utils/db";

import tasks from "./routes/tasks";
import logging from "./utils/logging";
import cors from "cors";

const port = 8080;

const server = express();
server.use(express.json());
server.use(cors());
server.use(logging);

const v1 = express.Router();

v1.use("/task", tasks);

server.use("/api/v1", v1);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
