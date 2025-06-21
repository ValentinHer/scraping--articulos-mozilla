import fs from "fs";

/**
 * 
 * @param {Array} data listado de datos
 * @param {string} nombreArchivo nombre del archivo a crear, ejemplo ("archivo.txt")
 */

export const crearArchivoTxt = (data, nombreArchivo) => {
  if (!Array.isArray(data)) throw new Error("Datos proporcionado inválidos");

  const contenido = data
    .map((item, index) => {
      const { imagen, titulo, parrafo, fechaPublicacion } = item;
      return (
        `Artículo ${index + 1}\n` +
        `Título: ${titulo}\n` +
        `Imagen: ${imagen}\n` +
        `Párrafo: ${parrafo}\n` +
        `Fecha de publicación: ${fechaPublicacion}\n` +
        `------------------------------\n`
      );
    })
    .join("\n");

  fs.writeFileSync(nombreArchivo, contenido, "utf-8");
  console.log("Archivo TXT creado");
};
