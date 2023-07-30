import mongoose from "mongoose";
import { ContenidoMensajeSchema } from "./VO_ContenidoMensajeSchema.js"; // Importamos el esquema correcto

const DatosMensajeSchema = new mongoose.Schema({
  fechaCreacion: {
    type: Date,
    required: true,
    trim: true,
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    trim: true,
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
    trim: true,
  },
  contenido: {
    // Cambiado el nombre de ContenidoMensaje a contenido
    type: ContenidoMensajeSchema, // Usamos el esquema importado correctamente
    required: true,
  },
});

const DatosMensaje = mongoose.model("DatosMensaje", DatosMensajeSchema);

export default DatosMensaje;
