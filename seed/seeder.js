import { exit } from 'node:process';
import categorias from "./categorias.js";
import precios from "./precios.js";
import db from "../config/db.js";
import { Categoria, Precio} from "../models/index.js"

const importarDatos = async () => {
    try {  
        // Autenticar en base de datos
        await db.authenticate();

        // Generar las columnas
        await db.sync();

        // Insertamos los datos
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios)
        ]);

        console.log('Datos importados correctamente.');
        exit(0); // Indica una salida exitosa

    } catch (error) {
        console.log(error);
        exit(1); // Indica que ocurrió un error
    }
};

const eliminarDatos = async () => {
    try {
        // Insertamos los datos
        // await Promise.all([
        //     Categoria.destroy({where: {}, truncate: true}),
        //     Precio.destroy({where: {}, truncate: true})
        // ]);
        await db.sync({force: true})
        console.log("Datos eliminados correctamente.")
        exit(0)
    } catch (error) {
        console.log(error);
        exit(1); // Indica que ocurrió un error
    }
}

if (process.argv[2] === "-i") {
    importarDatos();
}

if (process.argv[2] === "-e") {
    eliminarDatos();
}
