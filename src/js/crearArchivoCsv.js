import fs from "fs";
import { Parser } from "json2csv";

/**
 * @param {Array} data listado de datos
 * @param {string} nombreArchivo nombre del archivo a crear, ejemplo ("archivo.csv")
 */

export const crearArchivoCsv = (data, nombreArchivo) => {
  if (!Array.isArray(data)) throw new Error("Datos proporcionado inválidos");

  const fields = ["imagen", "titulo", "parrafo", "fechaPublicacion"];
  const json2csvParse = new Parser({
    fields,
    defaultValue: "No hay Información",
  });

  const csv = json2csvParse.parse(data);

  fs.writeFileSync(nombreArchivo, csv, "utf-8");
  console.log("Archivo CSV creado!!!");
};
