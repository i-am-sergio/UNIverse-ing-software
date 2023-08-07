import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reemplaza "User" con el nombre del modelo de usuarios si tienes uno
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reemplaza "User" con el nombre del modelo de usuarios si tienes uno
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Definición de métodos personalizados
messageSchema.statics.findBySender = async function (senderId) {
  return this.find({ sender: senderId });
};

messageSchema.statics.findMessagesInTimeRange = async function (startDate, endDate) {
  return this.find({
    timestamp: { $gte: startDate, $lte: endDate }
  });
};


const Message = mongoose.model("Message", messageSchema);

export default Message;
