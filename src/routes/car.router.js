import { Router } from 'express'
import __dirname from "../utils.js";
import { cartModel } from "../models/car.model.js";
import { productModel } from '../models/product.model.js';

const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
  const carts = await cartModel.find();
  res.json({
    status: "success",
    payload: carts,
  });
});

cartRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cartProducts = await cartModel.findById(cid).populate("products.product"); 
  if (!cartProducts) {
    res.send({ error: 'Carrito no encontrado' });
  } 
  res.send(cartProducts);
});

cartRouter.post('/', async (req, res) => {
  try {
    const { products } = req.body;

   const newCart = new cartModel({
    products : products || [],
   });

   await newCart.save();
  
    res.json({ success: 'Carrito creado', cart : newCart });
  } catch (e) {
    res.status(500).json({error : e});
  }
});

cartRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity) || 1; // Si no se envía quantity, se asume 1
  
  try {
  // Buscar el producto
  const product = await productModel.findById(pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Buscar el carrito
  const productCart = await cartModel.findById(cid);
  if (!productCart) {
    return res.status(404).json({ error: "Carrito no encontrado" });
  }

  // Verificar si el producto ya está en el carrito
  const existingProduct = productCart.products.find(item => item.product.toString() === pid);
  if (existingProduct) {
    existingProduct.quantity += quantity; 
  } else {
    productCart.products.push({ product: pid, quantity });
  }

  // Guardar cambios 
    await productCart.save();

    res.json({ success: "Producto agregado", cart: productCart });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el carrito" });
  }
});

//DELETE api/carts/:cid/product/:pid deberá eliminar del carrito el producto seleccionado.

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  
  try {
    // Buscar el producto
    const product = await productModel.findById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscar el carrito
    const productCart = await cartModel.findById(cid);

    if (!productCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

   // Verificar si el producto existe en el carrito
  const existingProduct = productCart.products.find(item => item.product.toString() === pid);
  if (!existingProduct) {
    return res.status(404).json({ error: "El producto no se encuentra en el carrito" });
  }

  // Eliminar el producto usando filter
  productCart.products = productCart.products.filter(item => item.product.toString() !== pid);

  // Guardar los cambios en la base de datos
  await productCart.save();

  res.json({ success: "Producto eliminado"});
  }catch(e){
    res.status(500).json({ error: 'Error al guardar los cambios' });
  }
});


// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
cartRouter.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const newProducts = req.body;
  // Buscar el carrito

  try {
    // Buscar el carrito por su ID
    const productCart = await cartModel.findById(cid);
    if (!productCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Actualizar el arreglo de productos del carrito
    productCart.products = newProducts;

    // Guardar los cambios en la base de datos
    await productCart.save();

    res.status(200).json({ message: "Carrito actualizado", cart: productCart });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT :cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
cartRouter.put('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; // Se espera un objeto con la propiedad 'quantity'

  try {
    // Buscar el carrito por su ID
    const productCart = await cartModel.findById(cid);
    if (!productCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto existe en el carrito
    const existingProduct = productCart.products.find(item => item.product.toString() === pid);
    if (!existingProduct) {
      return res.status(404).json({ error: "El producto no se encuentra en el carrito" });
    }

    existingProduct.quantity = typeof quantity === 'number' ? quantity : 1;

    // Guardar los cambios en la base de datos
    await productCart.save();

    res.status(200).json({ message: "Carrito actualizado", cart: productCart });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE api/carts/:cid deberá eliminar todos los productos del carrito 
cartRouter.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  
  try {
    // Buscar el carrito
    const productCart = await cartModel.findById(cid);

    if (!productCart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

  // Eliminar los productos
  productCart.products = [];

  // Guardar los cambios en la base de datos
  await productCart.save();

  res.json({ success: "Productos eliminados"});
  }catch(e){
    res.status(500).json({ error: 'Error al guardar los cambios' });
  }
});

export default cartRouter;