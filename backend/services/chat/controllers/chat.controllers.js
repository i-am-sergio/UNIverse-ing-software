import Message from "../models/Message.js";

export const getChats = async (req, res) => {
  try {
    const messages = await Message.find();
    res.send(messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    // Aquí puedes validar y procesar los datos recibidos antes de crear el mensaje
    const newMessage = new Message({
      sender,
      receiver,
      content,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ message: "Mensaje no encontrado" });
    }

    await message.remove();
    res.json({ message: "Mensaje eliminado exitosamente" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = await Message.find({
      $or: [{ sender: id }, { receiver: id }],
    });

    if (conversation.length === 0) {
      throw new Error("Conversación no encontrada");
    }

    res.json(conversation);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

