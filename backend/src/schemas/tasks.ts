import { Schema, model } from "mongoose";
import { Task } from "$/models/task";
const taskSchema = new Schema<Task>({
  title: { type: String, required: true },
  completed: { type: Boolean, required: true, default: false },
  doDate: {
    type: Date,
    required: function () {
      return this.dueDate != undefined;
    },
  },
  dueDate: {
    type: Date,
    required: function () {
      return this.dueDate != undefined;
    },
  },
  priority: { type: Number, required: true, default: 0 },
});

export const taskModel = model<Task>("Task", taskSchema);
