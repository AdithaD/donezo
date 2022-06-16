import { listModel } from "./schemas/list";
import { taskModel } from "./schemas/task";

export const resolvers = {
  Query: {
    tasks: async () => await taskModel.find(),
    lists: async () =>
      await listModel.aggregate([
        {
          $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "parent",
            as: "tasks",
          },
        },
      ]),
  },
  Mutation: {
    createList: (_, { title, color }) => {
      const list = new listModel({ title, color });
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
    completeTask: async (_, { _id }) => {
      const task = await taskModel.findByIdAndUpdate(_id, { completed: true });
      return task.id;
    },
  },
};
