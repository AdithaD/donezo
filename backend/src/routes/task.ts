import { AddTaskRequestBody, DBTask } from "$/models/task";
import { ObjectId } from "bson";
import dayjs from "dayjs";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { listModel } from "../schemas/list";
import { taskModel } from "../schemas/task";
import { APIError } from "../utils/error";

const router = express.Router();

router.post("/", addTask);

async function addTask(req: Request, res: Response) {
  const body = req.body as AddTaskRequestBody;

  if (!body.title || body.title.length < 1) {
    new APIError("BadRequestError", req, "Title is required").sendResponse(res);
    return;
  }

  if (body.priority && (body.priority < 0 || body.priority > 3)) {
    new APIError(
      "BadRequestError",
      req,
      "Priority must be between 0 and 3"
    ).sendResponse(res);
    return;
  }

  if (body.doDate) {
    if (!dayjs(body.doDate).isValid()) {
      new APIError("BadRequestError", req, "Invalid do date").sendResponse(res);
      return;
    }
  }

  if (body.dueDate) {
    if (!dayjs(body.dueDate).isValid()) {
      new APIError("BadRequestError", req, "Invalid due date").sendResponse(
        res
      );
      return;
    }
  }

  if (!ObjectId.isValid(body.parent)) {
    new APIError("BadRequestError", req, "Invalid parent").sendResponse(res);
    return;
  }

  const list = await listModel.findById(body.parent);

  if (!list) {
    new APIError("NotFoundError", req, "List not found").sendResponse(res);
  } else {
    const newTask: Omit<DBTask, "_id"> = {
      title: body.title,
      completed: false,
      priority: body.priority || 0,
      doDate: body.doDate || null,
      dueDate: body.dueDate || null,
      parent: new mongoose.Types.ObjectId(body.parent),
    };

    try {
      const created = await taskModel.create(newTask);

      res.status(201).send({ resource: created.id });
    } catch (error) {
      new APIError("InternalError", req, "Could not create task").sendResponse(
        res
      );
      return;
    }
  }
}

router.get("/:id", getTask);
async function getTask(req: Request, res: Response) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    new APIError("BadRequestError", req, "Invalid id").sendResponse(res);
  }

  try {
    const task = await taskModel.findById(id);

    if (!task) {
      new APIError("NotFoundError", req, "Task not found").sendResponse(res);
    } else {
      res.status(200).send(task);
    }
  } catch (error) {
    console.log(error);
    new APIError("InternalError", req, "Could not get task").sendResponse(res);
  }
}

router.get("/", getAllTasks);
async function getAllTasks(req: Request, res: Response) {
  const limit = Number(req.query.limit);

  let filterComplete: boolean | null = null;

  if (req.query.completed == "true" || req.query.completed == "True") {
    filterComplete = true;
  } else if (req.query.completed == "false" || req.query.completed == "False") {
    filterComplete = false;
  }

  try {
    const queryObj = {} as { completed?: boolean };
    if (filterComplete != null) {
      queryObj.completed = filterComplete;
    }

    console.log(queryObj);

    const query = taskModel.find(queryObj);
    if (!Number.isNaN(limit) && limit > 0) query.limit(limit);

    const tasks = await query;

    res.status(200).send(tasks);
  } catch (error) {
    new APIError("InternalError", req, "Could not get tasks").sendResponse(res);
  }
}

router.patch("/:id/complete", setTaskCompletion);
async function setTaskCompletion(req: Request, res: Response) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    new APIError("BadRequestError", req, "Invalid id").sendResponse(res);
  }

  const body = req.body as { completed: boolean };

  if (typeof body.completed !== "boolean") {
    new APIError(
      "BadRequestError",
      req,
      "Completed must be a boolean"
    ).sendResponse(res);
  }

  try {
    const task = await taskModel.findById(id);

    if (!task) {
      new APIError("NotFoundError", req, "Task not found").sendResponse(res);
    } else {
      if (task.completed != body.completed) {
        task.completed = body.completed;
        await task.save();
      }

      res.sendStatus(204);
    }
  } catch (error) {
    console.log(error);
    new APIError(
      "InternalError",
      req,
      "Could not set task completion"
    ).sendResponse(res);
  }
}

router.delete("/:id", deleteTask);
async function deleteTask(req: Request, res: Response) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    new APIError("BadRequestError", req, "Invalid id").sendResponse(res);
  }

  try {
    const oldTask = await taskModel.findByIdAndDelete(id);

    if (oldTask) {
      res.sendStatus(204);
    } else {
      new APIError("NotFoundError", req, "Task not found").sendResponse(res);
    }
  } catch (error) {
    console.log(error);
    new APIError("InternalError", req, "Could not delete task").sendResponse(
      res
    );
  }
}

export default router;
