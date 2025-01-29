import express from 'express';
import productsRouter from './routes/productos.router.js';
import cartRouter from './routes/cart.router.js';


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", middle1, productsRouter);
app.use("/api/cart", middle1, middle2, cartRouter);

function middle1(req, res, next) {
  console.log("Middleware 1");
  next();
}

function middle2(req, res, next) {
  console.log("Middleware 2");
  next();
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(8080, () => {
  console.log('Server is running on port: 8080');
});