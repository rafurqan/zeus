// server.js (Ultra-Minimal Logging Test)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Handler untuk path API. Ini adalah fokus kita.
app.all("/api/v1/*", (req, res) => {
  // Kita gunakan metode logging level rendah untuk memastikan pesan terkirim.
  // Karakter '\n' di akhir sangat penting.
  process.stdout.write("--- LOG TEST: API path /api/v1/* was successfully hit. ---\n");
  
  // Langsung kirim respons error untuk membuktikan handler ini berjalan.
  res.status(503).send("Test Response: API handler is working. Please check the Deploy Logs now.");
});

// Handler untuk path root, untuk memastikan server berjalan.
app.get("/", (req, res) => {
  process.stdout.write("--- LOG TEST: Root path '/' was hit. ---\n");
  // Sajikan file index.html hanya untuk path root.
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Handler untuk file statis
app.use(express.static(path.join(__dirname, "dist")));

app.listen(PORT, () => {
  process.stdout.write(`--- LOG TEST: Server started and listening on port ${PORT}. ---\n`);
});
