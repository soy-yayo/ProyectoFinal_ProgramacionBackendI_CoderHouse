import { Router } from "express";
import __dirname from "../utils.js";
import { productModel } from "../models/product.model.js";

const productsRouter = Router();



productsRouter.get("/", async (req, res) => {
  try {
    let {limit = 10, page = 1, sort, query} = req.query;
    limit = Number(limit);
    page = Number(page);

    let filter = {};
    if (query) {
      filter = { category: query };
    }

    let sortOptions = {};
    if (sort === "asc") {
      sortOptions = { price: 1 }; // Orden ascendente
    } else if (sort === "desc") {
      sortOptions = { price: -1 }; // Orden descendente
    }

    const products = await productModel.find(filter)
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

    //Obtener el total de productos y calcular páginas
    const totalDocs = await productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    // Construcción de enlaces
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const prevLink = hasPrevPage ? `${baseUrl}/?limit=${limit}&page=${prevPage}&sort=${sort || ""}&query=${query || ""}` : null;
    const nextLink = hasNextPage ? `${baseUrl}/?limit=${limit}&page=${nextPage}&sort=${sort || ""}&query=${query || ""}` : null;

    // Respuesta en formato JSON
    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    });

  } catch (error) {
    res.status(500).json({ status: "error", message: error });
  }
});

// Buscar producto por id
productsRouter.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productModel.find({id : pid});
  if (product) {
    res.send({ product });
  } else {
    res.send({ error: 'producto no encontrado' });
  }
});

// Crear un nuevo producto
routerProducts.post('/', async (req, res) => {
  const { name, price, category, thumbnail, stock,  id} = req.body;
  id = Math.floor(Math.random() * 1000);

  const newProduct = {
    name,
    price,
    category,
    thumbnail,
    stock,
    id
  }
  try {
    productModel.create(newProduct);
    res.json({ success: "Producto agregado", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

export default productsRouter;