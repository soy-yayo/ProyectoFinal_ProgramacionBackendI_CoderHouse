import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import { Server } from 'socket.io';
import fs from 'fs/promises';


const app = express();
const PORT = 8080;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);

io.on('connection', async (socket) => {
  console.log('Cliente conectado :D');

  try {
    const data = await fs.readFile(__dirname + '/data/rtp.json', 'utf-8');
    const products = JSON.parse(data);
    socket.emit("products", products);
    console.log("Productos enviados al cliente");
  } catch (error) {
    console.error("Error al leer productos:", error);
  }

  // Eliminar producto
  socket.on("deleteProduct", async (id) => {
    try {
      const data = await fs.readFile(__dirname + "/data/rtp.json", "utf-8");
      let products = JSON.parse(data);

      products = products.filter((product) => product.id !== id);

      await fs.writeFile(__dirname + "/data/rtp.json", JSON.stringify(products, null, 2));

      io.sockets.emit("products", products);
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  });

  // Agregar producto
  socket.on("newProduct", async (product) => {
    try {
      const data = await fs.readFile(__dirname + "/data/rtp.json", "utf-8");
      let products = JSON.parse(data);

      const exists = products.some(p => p.name.trim().toLowerCase() === product.name.trim().toLowerCase());
      if (exists) {
        console.log("Producto duplicado, no se agregará.");
      return;
      }

      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail
      };

      products.push(newProduct);

      await fs.writeFile(__dirname + "/data/rtp.json", JSON.stringify(products, null, 2));
      await fs.writeFile(__dirname + "/data/products.json", JSON.stringify(products, null, 2));

      io.sockets.emit("products", products);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado :(');
  });
});