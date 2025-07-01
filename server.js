// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios"; // Kita gunakan axios di sini

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// --- PROXY MANUAL UNTUK /api/v1 ---
// Menangkap semua metode (GET, POST, dll) ke path yang diawali /api/v1
app.all("/api/v1/*", async (req, res) => {
  // Buat URL tujuan ke backend
  // req.originalUrl akan berisi path lengkap, misal: /api/v1/students?page=1
  const targetUrl = `http://eudora${req.originalUrl}`;
  
  console.log(`--> Manual proxying request to: ${targetUrl}`);

  try {
    // Buat request ke backend menggunakan axios
    const response = await axios({
      method: req.method,
      url: targetUrl,
      // Teruskan body jika ada (untuk POST, PUT, dll)
      data: req.body,
      // Teruskan headers asli, seperti Authorization jika ada
      headers: req.headers,
      // Penting untuk mendapatkan response sebagai stream jika itu file besar
      responseType: 'stream'
    });

    // Kirim kembali response dari backend ke browser
    console.log(`<-- Received response from backend with status: ${response.status}`);
    res.status(response.status);
    response.data.pipe(res);

  } catch (error) {
    // --- INI BAGIAN PALING PENTING ---
    // Jika terjadi error koneksi, kita akan mencetaknya dengan sangat detail
    console.error("!!! MANUAL PROXY FAILED !!!");
    
    if (error.response) {
      // Error datang dari response backend (misal: 404, 500)
      console.error("Backend responded with an error:");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // Request dibuat tapi tidak ada response (masalah jaringan)
      console.error("No response received from backend. Network error.");
      console.error("Error Code:", error.code); // misal: ECONNREFUSED, ENOTFOUND
      console.error("Destination:", error.config.url);
      res.status(504).send("Gateway Timeout - Could not connect to backend service.");
    } else {
      // Error lain saat setup request
      console.error("Error setting up the proxy request:", error.message);
      res.status(500).send("Internal Server Error");
    }
  }
});


// Middleware untuk file statis dan fallback ke index.html
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server produksi berjalan di http://localhost:${PORT}`);
});
