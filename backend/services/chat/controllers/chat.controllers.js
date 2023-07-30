/**
 * Módulo de manejo de mensajes en un chat de red social.
 * @module chatHandlers
 */

import Message from "../models/Message.js";

/**
 * Obtiene todos los mensajes de chat disponibles.
 * @function getChats
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve una lista de mensajes de chat en formato JSON.
 * @throws {Error} - Si ocurre algún error en el servidor.
 */
export const getChats = async (req, res) => {
  try {
    const messages = await Message.find();
    res.send(messages);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Crea un nuevo mensaje y lo agrega a la base de datos.
 * @function createMessage
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve el mensaje creado en formato JSON con el código de estado 201 (CREATED).
 * @throws {Error} - Si ocurre algún error en el servidor.
 */
export const createMessage = async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
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

/**
 * Elimina un mensaje específico por su ID de la base de datos.
 * @function deleteMessage
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve un mensaje de éxito en formato JSON con el código de estado 200 (OK) si el mensaje se elimina correctamente.
 * @throws {Error} - Si el mensaje no se encuentra, devuelve un mensaje de error en formato JSON con el código de estado 404 (NOT FOUND).
 * @throws {Error} - Si ocurre algún error en el servidor.
 */
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

/**
 * Obtiene una conversación específica por el ID del remitente o receptor.
 * @function getConversation
 * @async
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Object} - Devuelve una lista de mensajes de chat que coinciden con el ID del remitente o receptor en formato JSON.
 * @throws {Error} - Si no se encuentran mensajes, devuelve un mensaje de error en formato JSON con el código de estado 500 (INTERNAL SERVER ERROR).
 */
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
