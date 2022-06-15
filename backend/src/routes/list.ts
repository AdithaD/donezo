import { List } from "$/models/list";
import express, { Request, Response, Router } from "express";
import { listModel } from "../schemas/list";
import { APIError } from "../utils/error";
import { ObjectId } from "bson";
import { taskModel } from "../schemas/task";

const router = express.Router();

router.post("/", addList);

type AddListRequestBody = {
  title: string;
  color?: string;
};
async function addList(req: Request, res: Response) {
  const body = req.body as AddListRequestBody;

  if (!body.title || body.title.length < 1) {
    new APIError("BadRequestError", req, "Title is required").sendResponse(res);
    return;
  }

  if (body.color && !/^#[0-9A-F]{6}$/i.test(body.color)) {
    new APIError(
      "BadRequestError",
      req,
      "Color must be a hex color"
    ).sendResponse(res);
    return;
  }

  const newList: Partial<Omit<List, "_id">> = {
    title: body.title,
    color: body.color,
  };

  try {
    const created = await listModel.create(newList);

    res.status(201).send({ resource: created.id });
  } catch (error) {
    console.log(error);
    new APIError("InternalError", req, "Could not create list").sendResponse(
      res
    );
  }
}

router.get("/:id", getList);
async function getList(req: Request, res: Response) {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    new APIError("BadRequestError", req, "Invalid id").sendResponse(res);
    return;
  }

  try {
    const list = await listModel.findById(id);
    const tasks = await taskModel.find({ parent: id });

    if (!list) {
      new APIError("NotFoundError", req, "List not found").sendResponse(res);
    } else {
      res.status(200).send({ ...list.toJSON(), tasks });
    }
  } catch (error) {
    console.log(error);
    new APIError("InternalError", req, "Could not get list").sendResponse(res);
  }
}

router.get("/", getLists);
async function getLists(req: Request, res: Response) {
  const limit = Number(req.query.limit);

  const pipeline = [
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "parent",
        pipeline: [{ $unset: ["parent"] }],
        as: "tasks",
      },
    },
  ] as any[];

  if (!Number.isNaN(limit) && limit > 0) pipeline.push({ $limit: limit });

  try {
    const lists = await listModel.aggregate(pipeline);

    res.status(200).send(lists);
  } catch (error) {
    console.log(error);
    new APIError("InternalError", req, "Could not get lists").sendResponse(res);
  }
}

export default router;
