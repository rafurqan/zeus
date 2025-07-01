// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173; // Railway akan menyediakan PORT

app.use(
  "/api/v1",
  createProxyMiddleware({
    target: process.env.VITE_BACKEND_URL || "http://eudora.railway.internal",
    changeOrigin: true,
  })
);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server produksi berjalan di http://localhost:${PORT}`);
});
