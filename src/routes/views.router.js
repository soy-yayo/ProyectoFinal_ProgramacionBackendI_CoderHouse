import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await JSON.parse(fs.readFileSync(__dirname + "/data/products.json", "utf-8"));
  res.render("home", { products });
});


export default viewsRouter;