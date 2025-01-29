import { Router } from "express";
import { promises as fs } from "fs";


const routerCart = Router();


const cart = [];
const products = [];

const cargarProductos = async () => {
  try {
    const data = await fs.readFile("./src/data/products.json");
    const productos = JSON.parse(data);
    productos.forEach(product => products.push(product));
  }
  catch (error) {
    console.log("Error al cargar productos");
  }
}

cargarProductos();


const cargarCarrito = async () => {
  try {
    const data = await fs.readFile("./src/data/cart.json");
    const carritos = JSON.parse(data);
    carritos.forEach(carrito => cart.push(carrito));
  }
  catch (error) {
    console.log("Error al cargar carritos");
  }
}
cargarCarrito();

// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
/*
Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
*/

routerCart.post('/', async (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const { products } = req.body;
  const newCart = {
    id,
    products: []
  }
  cart.push(newCart);
  try {
    fs.writeFile('./src/data/cart.json', JSON.stringify(cart), (err) => { if (err) { res.send({err}); } });
    res.send({ success: 'Carrito creado' });
  } catch (err) {
    res.send({err});
  }
});


//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

routerCart.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cartProducts = cart.find(cart => cart.id === parseInt(cid));
  if (!cartProducts) {
    res.send({ error: 'Carrito no encontrado' });
  } 

  res.send(cartProducts);
});

/*
La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
*/

routerCart.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity) || 1; // Si no se envía quantity, se asume 1

  // Buscar el producto en la lista de productos
  const product = products.find(product => product.id === parseInt(pid));
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Buscar el carrito en la lista de carritos
  const productCart = cart.find(cart => cart.id === parseInt(cid));
  if (!productCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  // Verificar si el producto ya está en el carrito
  const existingProduct = productCart.products.find(p => p.product === parseInt(pid));
  if (existingProduct) {
    existingProduct.quantity += quantity; // Incrementar cantidad
  } else {
    productCart.products.push({ product: pid, quantity });
  }

  // Guardar cambios en el archivo JSON
  try {
    await fs.writeFile('./src/data/cart.json', JSON.stringify(cart, null, 2));
    res.json({ success: "Producto agregado", cart: productCart });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el carrito" });
  }
});


export default routerCart;