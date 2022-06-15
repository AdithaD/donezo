import mongoose from "mongoose";

export type Task = {
  _id: string;
  title: string;
  completed: boolean;
  doDate: Date | null;
  dueDate: Date | null;
  priority: number;
};
export type DBTask = {
  _id: string;
  title: string;
  completed: boolean;
  doDate: Date | null;
  dueDate: Date | null;
  priority: number;
  parent: mongoose.Types.ObjectId;
};
export type AddTaskRequestBody = {
  title: string;
  parent: string;
  priority?: number;
  doDate?: Date | null;
  dueDate?: Date | null;
};
