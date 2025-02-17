import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";

const viewsRouter = Router();

viewsRouter.get("/", async (req, res) => {
  const products = await JSON.parse(fs.readFileSync(__dirname + "/data/products.json", "utf-8"));
  res.render("home", { title : "Productos agregados hasta el momento", products });
});

viewsRouter.get("/realtimeproducts", async (req, res) => {
  // const products = await JSON.parse(fs.readFileSync(__dirname + "/data/rtp.json", "utf-8"));
  res.render("realtimeproducts", { title : "Productos en tiempo real" });
});


export default viewsRouter;