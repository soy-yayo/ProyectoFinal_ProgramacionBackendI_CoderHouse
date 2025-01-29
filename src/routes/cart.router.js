import { Router } from "express";


const routerCart = Router();


const cart = {};

// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
/*
Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
products: Array que contendrá objetos que representen cada producto
*/

routerCart.post('/', (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  cart[id] = { id, products: [] };
  res.send({ cart: cart[id] });
});


//La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.

routerCart.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const cartProducts = cart[cid];
  if (cartProducts) {
    res.send(cartProducts);
  } else {
    res.send({ error: 'Carrito no encontrado' });
  }
});

/*
La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 
*/

routerCart.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  const product = cart[cid].products.find(product => product.id === pid);
  if (product) {
    product.quantity += quantity;
  } else {
    cart[cid].products.push({ id: pid, quantity });
  }
  res.send({ success: 'Producto agregado' });
});

