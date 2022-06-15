import { DBList } from "$/models/list";
import { model, Schema } from "mongoose";

const listSchema = new Schema<DBList>({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: "#FFA500",
    validate: { validator: (v) => /^#[0-9A-F]{6}$/i.test(v) },
  },
});

export const listModel = model<DBList>("List", listSchema);
