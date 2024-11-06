import express from "express";
import productsRouter from "./routes/productsRouter.js";
import cartsRouter from './routes/cartsRouter.js';
import handlebars from "express-handlebars";
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from "./models/ProductManager.js";

const app = express();
const PORT = 8080;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const productsPath = path.join(__dirname, "data", "products.json");
const productManager = new ProductManager(productsPath);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use(express.json())
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
