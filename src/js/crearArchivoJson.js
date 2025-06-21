import fs from "fs";

/**
 *
 * @param {Array} data listado de datos
 * @param {string} nombreArchivo nombre del archivo a crear, ejemplo ("archivo.json")
 */

export const crearArchivoJson = (data, nombreArchivo) => {
  if (!Array.isArray(data)) throw new Error("Datos proporcionado inválidos");

  // Crear archivo JSON
  let jsonData = JSON.stringify(data);
  fs.writeFileSync(nombreArchivo, jsonData);
  console.log("Archivo JSON creado!!!");
};
