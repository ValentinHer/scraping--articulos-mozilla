import XLSX from "xlsx";

/**
 * 
 * @param {Array} data listado de datos
 * @param {string} nombreArchivo nombre del archivo a crear, ejemplo ("archivo.xlsx")
 */

export const crearArchivoXlsx = (data, nombreArchivo) => {
  if (!Array.isArray(data)) throw new Error("Datos proporcionado inválidos");

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos mozilla Blog");
  XLSX.writeFile(workbook, nombreArchivo);

  console.log("Archivo XLSX creado!!!");
};
