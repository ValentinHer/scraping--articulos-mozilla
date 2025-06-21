import puppeteer from "puppeteer";
import fs from "fs";
import { Parser } from "json2csv";
import XLSX from "xlsx";

async function obtenerDatosMozillaBlog() {
  //1.- Instanciar navegador
  const navegador = await puppeteer.launch({
    headless: false,
    slowMo: 1000,
  });

  //2.- Abrir una nueva pestaña en navegador
  const pagina = await navegador.newPage();

  //3.- Ir a la página web
  await pagina.goto("https://hacks.mozilla.org/");

  const datos = await pagina.evaluate(() => {
    const resultados = [];
    document
      .querySelectorAll("li.list-item.row.listing")
      .forEach((elemento) => {
        const imagen = elemento.querySelector("img.avatar")?.src || "Sin imagen";
        const titulo = elemento.querySelector(".block > .post__title > a")?.innerText || "Sin título";
        const parrafo = elemento.querySelector("p")?.innerText || "Sin párrafo";
        const fechaPublicacion = elemento.querySelector(".block > .post__meta > .published")?.innerText || "Sin fecha";

        resultados.push({
            imagen,
            titulo,
            parrafo,
            fechaPublicacion,
        });
      });
    return resultados;
  });
  console.log(datos)

  // Crear archivo JSON
  let jsonData = JSON.stringify(datos);
  fs.writeFileSync("datosMozillaBlog.json", jsonData);
  console.log("Archivo JSON creado!!!");

  //Crear archivo CSV
  const fields = ["imagen", "titulo", "parrafo", "fechaPublicacion"];
  const json2csvParse = new Parser({
    fields,
    defaultValue: "No hay Información",
  });
  const csv = json2csvParse.parse(datos.map(item => item));
  fs.writeFileSync("datosMozillaBlog.csv", csv, "utf-8");
  console.log("Archivo CSV creado!!!");

  //Crear archivo XLSX
  const data = datos.map(item => {
    return {
      Titulo: item.titulo,
      Imagen: item.imagen,
      Parrafo: item.parrafo,
      FechaPublicacion: item.FechaPublicacion
    };
  })

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos mozilla Blog");
  XLSX.writeFile(workbook, "datosMozillaBlog.xlsx");

  console.log("Archivo XLSX creado!!!");

  // 8. Crear TXT
  const crearArchivoTxt = (datos) => {
    const contenido = datos
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

    fs.writeFileSync("articulos.txt", contenido, "utf-8");
    console.log(" Archivo TXT creado");
  };

  crearArchivoTxt(datos);

  navegador.close();
}

obtenerDatosMozillaBlog();
