import { model, Schema } from "mongoose";


const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  status: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  assignedTo: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  attachments:[{
    type:String
  }],
  todoCheckList:[todoSchema],
  progress:{
    type:Number,
    default: 0
  }
},{timestamps: true}
);

export const Task = model("Task",taskSchema);