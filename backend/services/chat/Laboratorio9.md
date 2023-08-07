# Laboratorio 9: Estilos de Programacion
## _Estilo Pipeline_

El estilo "Pipeline" se refiere a una técnica donde las funciones se comunican entre sí mediante la transmisión de datos de entrada y salida, en lugar de utilizar variables globales compartidas. El objetivo es organizar el programa como una secuencia de pasos o etapas (como en una línea de ensamblaje) donde cada función realiza una tarea específica y envía su resultado a la siguiente función como entrada. Esto permite que el programa sea más modular, fácil de entender y mantener.

Cada función en el controlador de rutas (`chat.routes.js`) representa una etapa del pipeline. Las funciones son responsables de llevar a cabo acciones específicas relacionadas con la gestión de mensajes y chats.

Cada controlador de ruta es una función que maneja una etapa en la cadena de **Pipeline**, donde recibe la solicitud (`req`), realiza una operación y devuelve una respuesta (`res`). El estilo de **Pipeline** es un enfoque de programación en el que las funciones se organizan en una secuencia de etapas, y los datos fluyen a través de esas etapas de manera estructurada.

- La función `getChats` es la primera etapa del pipeline. Esta función se encarga de obtener todos los mensajes de chat disponibles y los envía como datos de salida al siguiente paso en el pipeline.

- En la siguiente etapa, `createMessage`, se crea un nuevo mensaje utilizando los datos recibidos en la solicitud HTTP y luego lo envía al siguiente paso en el pipeline.

- La etapa `deleteMessage` se encarga de eliminar un mensaje específico, utilizando el identificador proporcionado en la solicitud HTTP, y luego pasa el control a la siguiente etapa en el pipeline.

- Finalmente, la etapa `getConversation` obtiene una conversación específica utilizando el identificador proporcionado en la solicitud HTTP y responde con los detalles de la conversación.

La implementación en el controlador (`chat.controllers.js`) de cada una de estas etapas se encarga de operar sobre los datos recibidos en la entrada y producir los resultados que se pasarán a la siguiente etapa del pipeline. Cada función se comunica únicamente a través de los datos de entrada y salida y no depende de variables globales para llevar a cabo su tarea.

Es importante mencionar que, en esta implementación, la cadena de llamadas a funciones está controlada por Express y se basa en las rutas definidas en el archivo `chat.routes.js`. El middleware de Express se encarga de invocar cada función en la secuencia adecuada según la ruta y el método HTTP que se esté utilizando en la solicitud.

- chat.routes.js
```javascript
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

```
- chat.controllers.js
```javascript
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


```

## _Estilo Constructivist_
La implementación del estilo "Constructivist" en el código se centra en manejar los errores encontrados y continuar proporcionando una respuesta "razonable" incluso si algo falla durante la obtención de los mensajes de chat.

El estilo "Constructivist" se puede observar en las siguientes partes del código:

**Uso de un bloque try-catch:**
El estilo "Constructivist" utiliza un bloque try-catch para capturar posibles errores que puedan ocurrir durante la ejecución de ciertas operaciones, como la consulta a la base de datos en este caso. Esto permite manejar los errores de manera controlada y proporcionar una respuesta apropiada al cliente en caso de que algo falle.

**Manejo del error:**
Dentro del bloque catch, se maneja el error capturado. En este caso, se muestra el mensaje de error en la consola para que los desarrolladores puedan rastrear el problema durante la fase de desarrollo. Además, se envía una respuesta JSON al cliente con un mensaje de error y un código de estado HTTP 500 (Internal Server Error) para indicar que hubo un problema en el servidor.

**Respuesta "razonable" en caso de error:**
En lugar de detener la ejecución del servidor o lanzar una excepción, el estilo "Constructivist" opta por proporcionar una respuesta "razonable" al cliente. En este ejemplo, si ocurre algún error durante la consulta a la base de datos, la función de controlador `getChats` enviará un mensaje de error con el código de estado 500, pero también devolverá una respuesta vacía con un arreglo de mensajes vacío. Esto permite que el cliente reciba una respuesta, incluso si los mensajes no se pueden recuperar correctamente.

En resumen, la implementación del estilo "Constructivist" en este código se enfoca en manejar los posibles errores de manera controlada y proporcionar una respuesta adecuada al cliente en caso de que ocurra algún problema durante la obtención de los mensajes de chat. En lugar de detenerse por completo, el código sigue ejecutándose y envía una respuesta "razonable" para asegurarse de que el servidor continúe funcionando de manera tolerante a fallos.

<!-- Centrar la imagen y darle dimensiones -->
- chat.controllers.js
```javascript
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

```

## _Estilo RestFul_
La implementación del estilo RESTful en el código proporcionado se centra en la creación de una API que sigue los principios y restricciones de REST (REpresentational State Transfer) para construir una interfaz interactiva entre un cliente y un servidor. A continuación, explicaré cómo se implementan los principios RESTful en el código detalladamente:

1. **Separación entre Cliente y Servidor:**
La separación entre cliente y servidor se logra al utilizar Express, una librería de Node.js, para crear el servidor y definir las rutas y controladores necesarios para manejar las solicitudes HTTP. Por otro lado, el cliente se encarga de hacer las solicitudes HTTP al servidor para obtener o enviar datos.

2. **Statelessness (Sin estado):**
RESTful implica que cada solicitud del cliente al servidor debe contener toda la información necesaria para que el servidor pueda procesar la solicitud sin necesidad de almacenar el estado del cliente en el servidor. En este código, cada solicitud contiene la información requerida en el cuerpo de la solicitud (por ejemplo, datos JSON) o en los parámetros de la URL (por ejemplo, ID en la ruta).

3. **Uniform Interface (Interfaz uniforme):**
En una interfaz uniforme RESTful, los recursos son identificados y manipulados a través de URLs. El servidor proporciona representaciones de recursos en formatos estándar (como JSON) y los clientes interactúan con estos recursos utilizando métodos HTTP (GET, POST, PUT, DELETE). En el código, podemos ver cómo se definen las rutas utilizando `app.use(chatRoutes)` y cómo se manejan las solicitudes GET, POST, PUT y DELETE en las rutas definidas en el archivo `chat.routes.js`.

4. **Recursos y Métodos HTTP:**
RESTful utiliza recursos (por ejemplo, una entidad de base de datos) como conceptos clave y los expone a través de URLs para que los clientes puedan interactuar con ellos mediante métodos HTTP. En este código, se están utilizando las rutas y los métodos HTTP para interactuar con los recursos de la aplicación, como la obtención de mensajes de chat, el envío de mensajes, etc.

5. **Recursos y Representación de Recursos:**
En RESTful, cada recurso tiene una representación, que suele ser en formato JSON o XML. La representación es lo que el servidor devuelve al cliente cuando se realiza una solicitud para un recurso en particular. En el código, vemos cómo se devuelven los mensajes de chat en formato JSON cuando se realiza una solicitud para obtener los mensajes.

La implementación del estilo RESTful en el código se logra al crear una API que sigue los principios y restricciones de REST. Se definen rutas y controladores para cada recurso, y el cliente interactúa con estos recursos utilizando métodos HTTP y URLs. Los datos se intercambian en formato JSON entre el cliente y el servidor, lo que proporciona una interfaz uniforme y sin estado para una comunicación efectiva entre ambas partes.

- app.js
```javascript
import express from "express";
import fileUpload from "express-fileupload";
import chatRoutes from "./routes/chat.routes.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// middlewares
app.use(cors())
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);

// routes
app.use(chatRoutes);
console.log(__dirname);
app.use(express.static(join(__dirname, "../client/build")));

export default app;
```

- index.js

```javascript
import app from './app.js'
import { connectDB } from "./db.js";
import { PORT } from "./config.js";

connectDB();
app.listen(PORT);
console.log(`Server on port ${PORT}`);
```


