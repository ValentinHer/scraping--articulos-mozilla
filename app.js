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
      .querySelectorAll("main>div:first-child>div:nth-child(2)>div>div.o.q")
      .forEach((elemento) => {
        const imagen = elemento.querySelector("img").src;

        const titulo = elemento.querySelector("block block--1 > post_title > a").href;
        const parrafo = elemento.querySelector("block block--1 > post_tease ").innerText;
        const fechaPublicacion = elemento.querySelector("block block--1 > post_meta > published").innerText;
        const data = {
            pagina:{
             imagen,
             titulo,
             parrafo,
             fechaPublicacion
            }
        };

        resultados.push(data);
      });
    return resultados;
  });

  // Crear archivo JSON
  let jsonData = JSON.stringify(datos);
  fs.writeFileSync("mozilla.json", jsonData, "utf-8");
  console.log("Archivo JSON creado!!!");

  //Crear archivo CSV
  const fields = ["imagen", "titulo", "parrafo", "fechaPublicacion"];
  const json2csvParse = new Parser({
    fields,
    defaultValue: "No hay Información",
  });
  const csv = json2csvParse.parse(datos.map(item => item.pagina));
  fs.writeFileSync("datosMozillaBlog.csv", csv, "utf-8");
  console.log("Archivo CSV creado!!!");

  //Crear archivo XLSX
  const data = datos.map(item => {
    return {
      Titulo: item.pagina.titulo,
      Imagen: item.pagina.imagen,
      Parrafo: item.pagina.parrafo,
      FechaPublicacion: item.pagina.FechaPublicacion
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
        const { imagen, titulo, parrafo, fechaPublicacion } = item.pagina;
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
