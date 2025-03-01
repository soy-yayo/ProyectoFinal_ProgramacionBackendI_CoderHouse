import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import carRouter from './routes/car.router.js'
import mongoose from 'mongoose';
import { productModel } from './models/product.model.js';

const app = express();
const PORT = 8080;
const server = app.listen(PORT, () => console.log("Listening on port: " + PORT));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/api/products', productsRouter);
app.use('/api/carts', carRouter);

mongoose.connect('<link mongodb>')
.then(() => {
  console.log("Conexión a la base de datos exitosa.");
}).catch((e) => {
  console.log("Error al conectarce a la BD: " + e);
})

//Creacion de productos
// const products = [
// {
//   name : 'Barra Quaker® Stila® con relleno sabor Moras',
// price : 13,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176184797_720x840.png',
// stock : 3,
// id : 12345},

// {
//   name : 'Barra Quaker® Stila® con relleno sabor Manzana y Canela',
// price : 17,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176184798_720x840.png',
// stock : 5,
// id : 12346},

// {
//   name : 'Barra Quaker® Stila® con relleno sabor Fresa',
// price : 14,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186329_720x840.png',
// stock : 1,
// id : 12347},

// {
//   name : 'Barra Quaker® Stila® Fit sabor Frutos Rojos',
// price : 18,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047801055_720x840.png',
// stock : 8,
// id : 12348},

// {
//   name : 'Barra Quaker® Stila® Fit con chispas sabor Chocolate',
// price : 15,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186481_720x840.png',
// stock : 3,
// id : 12349},

// {
//   name : 'Galleta de avena Quaker® Línea 0% Vainilla',
// price : 16,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800616_720x840.png',
// stock : 2,
// id : 12341},

// {
//   name : 'Galletas de avena Quaker® Moras y Yogurt',
// price : 17,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800472.1_720x840.png',
// stock : 2,
// id : 12342},

// {
//   name : 'Galletas de avena Quaker® Manzana y Canela',
// price : 17,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800472_M720x840.png',
// stock : 3,
// id : 12343},

// {
//   name : 'Galletas de avena Quaker® Granola',
// price : 15,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800468_720x840.png',
// stock : 3,
// id : 12344},

// {
//   name : 'Galletas de avena Quaker® Frutos Rojos',
// price : 14,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800471_720x840.png',
// stock : 4,
// id : 52345},

// {
//   name : 'Galletas de avena Quaker® Chocolate',
// price : 16,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800469_720x840.png',
// stock : 5,
// id : 42345},

// {
//   name : 'Galleta de Avena Quaker® Línea 0% Almendras',
// price : 18,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750047800614_720x840.png',
// stock : 7,
// id : 32345},

// {
//   name : 'Barra de Avena Quaker® Nutural Balance sabor Chocolate',
// price : 17,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186420_720x840.png',
// stock : 8,
// id : 22345},

// {
//   name : 'Barra de Avena Quaker® Nutural Balance sabor Arándano',
// price : 18,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186556_720x840.png',
// stock : 9,
// id : 62345},

// {
//   name : 'Barra de Avena Quaker® con relleno sabor Piña',
// price : 17,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176181025_720x840.png',
// stock : 9,
// id : 72345},

// {
//   name : 'Barra de Avena Quaker® con relleno sabor Fresa',
// price : 16,
// category : 'Barra',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176181020._720x840.png',
// stock : 1,
// id : 82345},

// {
//   name : 'Galleta suave de avena Quaker® tipo Artesanal Chocolate y Almendra',
// price : 19,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186419.1_720x840_3.png',
// stock : 2,
// id : 92345},

// {
//   name : 'Galleta suave de avena Quaker® tipo Artesanas Plátano y Nuez',
// price : 19,
// category : 'Galletas',
// thumbnail : 'https://quaker.lat/mx/sites/default/files/2023-07/750176186419_720x840-360x420.png',
// stock : 0,
// id : 92345}

// ]

// let result = await productModel.insertMany(products);
// console.log(result);
