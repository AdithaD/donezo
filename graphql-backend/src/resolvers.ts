import { listModel } from "./schemas/list";
import { taskModel } from "./schemas/task";
import mongoose from "mongoose";

export const resolvers = {
  Query: {
    tasks: async (_, { limit, completed }) => {
      const query = taskModel.find(completed ? { completed } : {});

      const numLimit = Number(limit);
      if (limit && Number.isInteger(numLimit) && numLimit > 0) {
        query.limit(numLimit);
      }
      return await query.exec();
    },
    lists: async (_, { limit }) => {
      const pipeline: any[] = [
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "parent",
            as: "tasks",
          },
        },
      ];

      if (limit != undefined && Number.isInteger(limit) && limit > 0) {
        pipeline.unshift({ $limit: limit });
      }

      const lists = await listModel.aggregate(pipeline);
      return lists;
    },

    list: async (_, { _id }) => {
      const list = await listModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "parent",
            as: "tasks",
          },
        },
      ]);
      console.log(list);
      return list.length > 0 ? list[0] : null;
    },
    task: async (_, { _id }) => await taskModel.findById(_id),
  },
  Mutation: {
    createList: (_, { title, color }) => {
      const list = new listModel({ title, color: color ?? "#ffffff" });
      return list.save();
    },
    createTask: (_, { title, parent, priority, doDate, dueDate }) => {
      const task = new taskModel({
        title,
        parent,
        doDate: doDate ?? null,
        dueDate: dueDate ?? null,
        priority: priority ?? 0,
      });
      return task.save();
    },
    setTaskCompletion: async (_, { _id, completed }) => {
      const task = await taskModel.findByIdAndUpdate(_id, { completed });
      return task.id;
    },
    deleteTask: async (_, { _id }) => {
      const task = await taskModel.findByIdAndDelete(_id);
      return task.id;
    },
  },
};
