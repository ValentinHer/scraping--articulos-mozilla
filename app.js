import puppeteer from "puppeteer";
import fs from "fs";
import { Parser } from "json2csv";
import XLSX from "xlsx";

async function obtenerDatosAngularBlog() {
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

        const titulo = elemento.querySelector("div>a>h2").innerText;
        const parrafo = elemento.querySelector("div>a>div>h3").innerText;
        const fechaPublicacion = elemento.querySelector("div>span>div>div").innerText;
        const data = {
          imagen,
          titulo,
          parrafo,
          fechaPublicacion
        };

        resultados.push(data);
      });
    return resultados;
  });

  // Crear archivo JSON
  let jsonData = JSON.stringify(datos);
  fs.writeFileSync(".json", jsonData, "utf-8");
  console.log("Archivo JSON creado!!!");

  //Crear archivo CSV
  const fields = ["imagen", "titulo", "parrafo", "fechaPublicacion"];
  const json2csvParse = new Parser({
    fields,
    defaultValue: "No hay Información",
  });
  const csv = json2csvParse.parse(datos.map(item => item.articulo));
  fs.writeFileSync("datosAngularBlog.csv", csv, "utf-8");
  console.log("Archivo CSV creado!!!");

  //Crear archivo XLSX
  const data = datos.map(item => {
    return {
      Titulo: item.articulo.titulo,
      Texto: item.articulo.texto,
      Autor: item.articulo.autor.nombre,
      Avatar: item.articulo.autor.avatar,
      Fecha: item.articulo.fecha,
      Likes: item.articulo.reacciones.likes,
      Comentarios: item.articulo.reacciones.comentarios
    };
  })

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos Angular Blog");
  XLSX.writeFile(workbook, "datosAngularBlog.xlsx");

  console.log("Archivo XLSX creado!!!");


  navegador.close();
}

obtenerDatosAngularBlog();
