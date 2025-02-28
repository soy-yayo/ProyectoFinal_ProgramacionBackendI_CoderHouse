import { Router } from 'express'
import __dirname from "../utils.js";
import { carModel } from "../models/car.model.js";

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
  const cartProducts = await carModel.findById(cid); 
  if (!cartProducts) {
    res.send({ error: 'Carrito no encontrado' });
  } 
  res.send(cartProducts);
});

carRouter.post('/', async (req, res) => {
  const { products } = req.body;
  const newCart = {
    products
  }
  try {
    await carModel.create(newCart);
    res.send({ success: 'Carrito creado' });
  } catch (err) {
    res.send({err});
  }
});