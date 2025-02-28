import { Router } from 'express'
import __dirname from "../utils.js";
import { carModel } from "../models/car.model.js";
import { productModel } from '../models/product.model.js';

const carRouter = Router();

carRouter.get('/', async (req, res) => {
  const carts = await carModel.find();
  res.json({
    status: "success",
    payload: carts,
  });
});

carRouter.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cartProducts = await carModel.findById(cid).populate("products.product"); 
  if (!cartProducts) {
    res.send({ error: 'Carrito no encontrado' });
  } 
  res.send(cartProducts);
});

carRouter.post('/', async (req, res) => {
  try {
    const { products } = req.body;

   const newCart = new carModel({
    products : products || [],
   });

   await newCart.save();
  
    res.json({ success: 'Carrito creado', cart : newCart });
  } catch (e) {
    res.status(500).json({error : e});
  }
});

carRouter.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = parseInt(req.body.quantity) || 1; // Si no se envía quantity, se asume 1
  
  try {
  // Buscar el producto
  const product = await productModel.findById(pid);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  // Buscar el carrito
  const productCart = await carModel.findById(cid);
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

export default carRouter;