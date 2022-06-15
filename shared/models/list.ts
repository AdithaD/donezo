import { Schema } from "mongoose";
import { Task } from "./task";

export type List = {
  _id: string;
  title: string;
  color: string;
  tasks: Task[];
};

export type DBList = Omit<List, "tasks"> & { tasks: Schema.Types.ObjectId[] };

export type AddListRequestBody = {
  title: string;
  color?: string;
};
