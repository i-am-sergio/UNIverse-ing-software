import mongoose from "mongoose";

const ContenidoMensajeSchema = new mongoose.Schema({
  mensaje: {
    type: String,
    required: true,
    trim: true,
  },
  imagen: {
    type: Blob,
    required: true,
    trim: true,
  },
  video: {
    type: Video,
    required: true,
    trim: true,
  },
});

const ContenidoMensaje = mongoose.model(
  "ContenidoMensaje",
  ContenidoMensajeSchema
);

export default ContenidoMensaje;
