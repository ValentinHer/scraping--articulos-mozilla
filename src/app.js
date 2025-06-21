import puppeteer from "puppeteer";
import {crearArchivoJson} from "./js/crearArchivoJson.js";
import {crearArchivoCsv} from "./js/crearArchivoCsv.js";
import {crearArchivoXlsx} from "./js/crearArchivoXlsx.js";
import {crearArchivoTxt} from "./js/crearArchivoTxt.js";
import {crearArchivoPdf} from "./js/crearArchivoPdf.js";

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

  navegador.close();

  console.log(datos)

  // Crear archivo JSON
  crearArchivoJson(datos, "datosMozillaBlog.json");

  //Crear archivo CSV
  crearArchivoCsv(datos, "datosMozillaBlog.csv");

  //Crear archivo XLSX
  const data = datos.map(item => {
    return {
      Titulo: item.titulo,
      Imagen: item.imagen,
      Parrafo: item.parrafo,
      FechaPublicacion: item.FechaPublicacion
    };
  })

  crearArchivoXlsx(data, "datosMozillaBlog.xlsx");

  //Crear archivo TXT
  crearArchivoTxt(datos, "datosMozillaBlog.txt");

  //Crear archivo PDF
  crearArchivoPdf(datos, "datosMozillaBlog.pdf")

}

obtenerDatosMozillaBlog();
