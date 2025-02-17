import { Router } from "express";
import fs from "fs";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await JSON.parse(fs.readFileSync("products.json", "utf-8"));
  res.render("index", { title: "Productos agregados hasta el momento", products });
});

