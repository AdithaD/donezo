import { DBTask } from "$/models/task";
import { model, Schema } from "mongoose";
const taskSchema = new Schema<DBTask>({
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
  parent: { type: Schema.Types.ObjectId, ref: "List" },
});

export const taskModel = model<DBTask>("Task", taskSchema);
