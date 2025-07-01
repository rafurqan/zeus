// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Fungsi untuk menangani error dari proxy
const onProxyError = function (err, req, res) {
  // Mencetak pesan error yang detail ke Deploy Logs
  console.error("PROXY ERROR:", err);
  // Anda bisa mengirim respon error kustom jika perlu,
  // tapi untuk sekarang, biarkan Express yang menanganinya.
};

app.use(
  "/api/v1",
  createProxyMiddleware({
    target: "http://eudora",
    changeOrigin: true,
    logLevel: "debug",
    // --- PENAMBAHAN DI SINI ---
    // Kita memberitahu proxy untuk menjalankan fungsi kita jika terjadi error
    onError: onProxyError,
  })
);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server produksi berjalan di http://localhost:${PORT}`);
});
