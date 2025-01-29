import { Router } from "express";
import fs from 'fs';

const routerProducts = Router();

/*
  La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
*/

const products =[];

async function cargarProductos() {
  const data = await fs.promises.readFile('./src/data/products.json');
  const productos = JSON.parse(data);
  productos.forEach(producto => {
    products.push(producto);
  });
}
cargarProductos();

routerProducts.get('/', (req, res) => {
  let { limit } = req.query;

  // Convertir limit a número y verificar si es válido
  limit = Number(limit);
  
  if (!isNaN(limit) && limit > 0) {
      return res.json(products.slice(0, limit));
  }

  res.json(products);
});

routerProducts.get('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = products.find(product => product.id === pid);
  if (product) {
    res.send({product});
  } else {
    res.send({error: 'producto no encontrado'});
  }
});

//La ruta raíz POST / deberá agregar un nuevo producto con los campos:
routerProducts.post('/', (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const { title, description, code, price, status, stock, category, thumbnail } = req.body;
  if (!title || !description || !code || !price || !status || !stock || !category || !thumbnail) {
    res.send({error: 'Todos los campos son obligatorios'});
    return;
  }
  products.push({ id, title, description, code, price, status, stock, category, thumbnail });

  fs.appendFile('./src/data/products.json', JSON.stringify({ id, title, description, code, price, status, stock, category, thumbnail }),
  (err) => {
    if (err) {
      res.send({error: 'Error al guardar el producto'});
    }
  });
  res.send({success: 'Producto agregado'});
});

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. 
routerProducts.put('/:pid', (req, res) => {
  const { pid } = req.params; // pid es el id del producto
  const { title, description, code, price, status, stock, category, thumbnail } = req.body; // Datos del producto
  const product = products.findIndex(product => product.id === parseInt(pid)); // Buscar el producto por id
  if (!product) {
    res.status(404).send({error: 'Producto no encontrado'});
    return;
  }
  products[product] = {
    ...products[product],
    title: title || products[product].title,
    description: description || products[product].description,
    code: code || products[product].code,
    price: price || products[product].price,
    status: status || products[product].status,
    stock: stock || products[product].stock,
    category: category || products[product].category,
    thumbnail: thumbnail || products[product].thumbnail
  }
  fs.writeFile('./src/data/products.json', JSON.stringify(products), (err) => {if (err) {res.send({error: err});}});
  res.send({success: 'Producto actualizado'});
});

//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
routerProducts.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  const product = products.findIndex(product => product.id === parseInt(pid));
  if (!product) {
    res.status(404).send({error: 'Producto no encontrado'});
    return;
  }
  products.splice(product, 1);
  fs.writeFile('./src/data/products.json', JSON.stringify(products), (err) => {if (err) {res.send({error: err});}});
  res.send({success: 'Producto eliminado'});
});

export default routerProducts;