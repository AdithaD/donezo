export type Task = {
  _id: string;
  title: string;
  completed: boolean;
  doDate: Date | null;
  dueDate: Date | null;
  priority: number;
};
export type AddTaskRequestBody = {
  title: string;
  priority?: number;
  doDate?: Date | null;
  dueDate?: Date | null;
};
