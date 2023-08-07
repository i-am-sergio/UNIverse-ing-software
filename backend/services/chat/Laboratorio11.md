# Laboratorio 11: Principios SOLID

## Principio de Responsabilidad Única (Single Responsibility Principle):

En el módulo de manejo de mensajes en un chat de red social, se ha aplicado el Principio de Responsabilidad Única (Single Responsibility Principle) de SOLID de manera coherente y organizada. Cada función exportada se encarga de tareas específicas y tiene una única responsabilidad, lo que facilita la comprensión, el mantenimiento y la escalabilidad del código.

La función `getChats` se dedica exclusivamente a obtener todos los mensajes de chat disponibles desde la base de datos y responder con la lista de mensajes en formato JSON. Esta función se centra únicamente en la recuperación y entrega de datos, sin mezclar responsabilidades adicionales.

La función `createMessage` se encarga exclusivamente de crear un nuevo mensaje y agregarlo a la base de datos. Esta función se preocupa únicamente por el proceso de creación y almacenamiento de mensajes, sin interferir en otras tareas como la validación de datos o la gestión de la base de datos.

La función `deleteMessage` tiene la única responsabilidad de eliminar un mensaje específico de la base de datos, basándose en su ID. Al igual que las otras funciones, esta se concentra en una tarea bien definida, sin involucrar tareas no relacionadas.

Por último, la función `getConversation` se dedica a obtener una conversación específica basada en el ID del remitente o receptor. Nuevamente, esta función está enfocada en la recuperación de datos de la base de datos y la presentación de la información correspondiente.

La separación clara de responsabilidades en estas funciones cumple con el Principio de Responsabilidad Única, lo que facilita la mantenibilidad del código y permite que cada función sea modificada o extendida sin afectar otras partes del sistema. Esta organización también promueve la reutilización de código y la creación de componentes cohesivos y autónomos, en línea con los principios de diseño sólido.

```javascript
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

```

## Principio de Abierto/Cerrado (Open/Closed Principle)

El Principio de Abierto/Cerrado (Open/Closed Principle) establece que las entidades de software deben estar abiertas para la extensión pero cerradas para la modificación. Este principio busca promover la capacidad de agregar nuevas funcionalidades o realizar cambios en el sistema sin alterar el código existente. Veamos cómo las funciones personalizadas definidas en el modelo de Mongoose (`Message`) se ajustan a este principio:

1. **Función `findBySender`**:

   Esta función personalizada permite buscar mensajes según el remitente. Siguiendo el Principio de Abierto/Cerrado:

   - **Cerrado para Modificación**: La función `findBySender` se agrega como un método estático en el modelo `Message`, lo que significa que no es necesario modificar el código existente del modelo o las funciones ya implementadas para agregar esta funcionalidad. Esto garantiza que el comportamiento original del modelo permanezca intacto.
   
   - **Abierto para Extensión**: Si necesitas buscar mensajes por remitente en el futuro o agregar otras operaciones de búsqueda personalizadas, puedes hacerlo definiendo más funciones personalizadas en el mismo estilo. No necesitas modificar la implementación original, lo que mantiene la cohesión y la consistencia del modelo.

2. **Función `findMessagesInTimeRange`**:

   Esta función personalizada permite buscar mensajes en un intervalo de tiempo específico. Aplicando el Principio de Abierto/Cerrado:

   - **Cerrado para Modificación**: Al igual que en el caso anterior, esta función se agrega como un método estático en el modelo `Message`. No es necesario modificar las funciones existentes o el comportamiento original del modelo para implementar esta funcionalidad.
   
   - **Abierto para Extensión**: Si en el futuro necesitas realizar búsquedas más complejas basadas en la fecha, puedes crear nuevas funciones personalizadas sin afectar el código existente. Esto mantiene el modelo flexible para futuras extensiones.

En resumen, tanto la función `findBySender` como la función `findMessagesInTimeRange` encajan bien con el Principio de Abierto/Cerrado. Puedes extender las capacidades del modelo añadiendo nuevas funciones personalizadas sin cambiar el código existente. Esto ayuda a mantener la integridad y la estabilidad del modelo de Mongoose mientras permites la incorporación de nuevas funcionalidades en el futuro.

- Modelo Message
```javascript
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  // Definición de campos...
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


```