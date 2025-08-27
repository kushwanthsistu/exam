// frontend/index.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import open from "open";

const app = express();
const PORT = 4000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve all static files
app.use(express.static(__dirname));

// Route for root index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}`);;
});