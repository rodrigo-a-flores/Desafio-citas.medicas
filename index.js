import express from "express";
import axios from "axios";
import _ from "lodash";
import chalk from "chalk";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT ?? 4040;
const url = "https://randomuser.me/api/";
const usuarios = [];
const formatoFecha = "MMMM Do YYYY: hh:mm:ss a";

app.listen(PORT, () => {
    console.log(`El servidor está inicializado en el puerto http://localhost:${PORT}/usuarios`);
});

app.get("/usuarios", async (req, res) => {
    try {
        const userApi = await axios.get(url);
        const nombre = userApi.data.results[0].name.first;
        const apellido = userApi.data.results[0].name.last;
        const genero = userApi.data.results[0].gender;
        const id = uuidv4().slice(0,5);
        const tiempo = moment().format(formatoFecha);
        usuarios.push({ nombre, apellido, genero, id, tiempo });
        const usuariosXGenero = _.partition(usuarios, (user) => {
            return user.genero === "female" ?? "male";
        });
        const template = `        
            <h1>Resultados</h1>
            <p>(F5) => Recargar la pagina para visualizar resultados</p>
            <p>=====================================================</p>
            <h2>Mujeres</h2>
            <ol>
                ${usuariosXGenero[0].map((user) => {
                return `<li>Nombre: ${user.nombre} - Apellido: ${user.apellido} - Id: ${user.id} - TimeStamp: ${user.tiempo}</li>`;
                })}
            </ol>
            <h2>Hombres</h2>
            <ol>
                ${usuariosXGenero[1].map((user) => {
                return `<li>Nombre: ${user.nombre} - Apellido: ${user.apellido} - Id: ${user.id} - TimeStamp: ${user.tiempo}</li>`;
                })}
            </ol>           
        `;
        console.log(chalk.blue.bgYellow(
            `${chalk.italic.bold("Nombre:" + nombre)} - ${chalk.italic.red("Apellido:" + apellido)} - ${chalk.italic.bold("Id:" + id)} - ${chalk.italic.red("TimeStamp:" + tiempo)}\n`
        ));
        res.send(template);
    } catch (error){
        console.log("Archivo no visualizado" + error);
    }
});