import PDFDocument from "pdfkit";
import fs from "fs";

/**
 * 
 * @param {Array} data listado de datos
 * @param {string} nombreArchivo nombre del archivo a crear, ejemplo ("archivo.pdf")
 */

export const crearArchivoPdf = (data, nombreArchivo) => {
  if (!Array.isArray(data)) throw new Error("Datos proporcionado inválidos");

  const doc = new PDFDocument();
  const stream = fs.createWriteStream(nombreArchivo);
  doc.pipe(stream);

  data.forEach((item, index) => {
    const { imagen, titulo, parrafo, fechaPublicacion } = item;

    doc.fontSize(14).text(`Artículo ${index + 1}`, { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Título: ${titulo}`);
    doc.moveDown(0.2);

    doc.fontSize(12).text(`Imagen: ${imagen}`);
    doc.moveDown(0.2);

    doc.fontSize(12).text(`Párrafo: ${parrafo}`);
    doc.moveDown(0.2);

    doc.fontSize(12).text(`Fecha de publicación: ${fechaPublicacion}`);
    doc.moveDown(1);

    doc.moveDown(1);
    doc.text("------------------------------------------------------------");
    doc.moveDown(1);
  });
  doc.end();

  console.log("Archivo PDF creado");
};
