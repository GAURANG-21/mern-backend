import mongoose from "mongoose";

const statsSchema = mongoose.Schema({
  users: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  subscriptions: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now()),
  },
});

const Stats = await mongoose.model("Stats", statsSchema);

export { Stats };
