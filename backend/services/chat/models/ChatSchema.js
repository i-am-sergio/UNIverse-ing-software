import mongoose from "mongoose";
import { mensajeSchema } from "./entidades";

const ChatSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        trim: true,
    },
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        trim: true,
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
        trim: true,
    },
    mensajes: {
        type: [mensajeSchema],
        required: true,
        trim: true,
    },
});
const Chat = mongoose.model("Chat", ChatSchema);
export default Chat;
