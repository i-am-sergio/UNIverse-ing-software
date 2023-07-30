import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  getConversation,
  getChats,
} from "../controllers/chat.controllers.js";

const router = Router();

router.get("/chats", getChats);

router.post("/chats", createMessage);

router.delete("/chats/:id", deleteMessage);

router.get("/chats/:id", getConversation);

export default router;
