import { Router } from "express";
import { promises as fs } from "fs";

const routerProducts = Router();

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
    res.send({ product });
  } else {
    res.send({ error: 'producto no encontrado' });
  }
});

//La ruta raíz POST / deberá agregar un nuevo producto con los campos:
routerProducts.post('/', async (req, res) => {
  const id = Math.floor(Math.random() * 1000);
  const { title, description, code, price, status, stock, category, thumbnail } = req.body;

  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnail
  }
  products.push(newProduct);
  try {
    await fs.writeFile("./src/data/products.json", JSON.stringify(products, null, 2));
    res.json({ success: "Producto agregado", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. 
routerProducts.put('/:pid', async (req, res) => {
  const { pid } = req.params; // pid es el id del producto
  const product = products.findIndex(product => product.id === parseInt(pid)); // Buscar el producto por id
  if (product === -1) {
    res.status(404).send({ error: 'Producto no encontrado' });
    return;
  }
  const { title, description, code, price, status, stock, category, thumbnail } = req.body; // Datos del producto
  products[product] = {
    ...products[product],
    title: title ?? products[product].title,
    description: description ?? products[product].description,
    code: code ?? products[product].code,
    price: price ?? products[product].price,
    status: status ?? products[product].status,
    stock: stock ?? products[product].stock,
    category: category ?? products[product].category,
    thumbnail: thumbnail ?? products[product].thumbnail,
  };
  try {
    await fs.writeFile("./src/data/products.json", JSON.stringify(products, null, 2));
    res.json({ success: "Producto actualizado", product: products[product] });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

//La ruta DELETE /:pid deberá eliminar el producto con el pid indicado. 
routerProducts.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = products.find(product => product.id === parseInt(pid));
  if (!product) {
    res.status(404).send({ error: 'Producto no encontrado' });
    return;
  }
  const deleted = products.splice(products.indexOf(product), 1);

  try {
    await fs.writeFile("./src/data/products.json", JSON.stringify(products, null, 2));
    res.json({ success: "Producto eliminado", product: deleted });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

export default routerProducts;