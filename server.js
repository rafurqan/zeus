// server.js (Simplified for Debugging)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// --- PROXY MANUAL UNTUK /api/v1 ---
// Ini adalah SATU-SATUNYA handler untuk path /api/vx1/*
app.all("/api/v1/*", async (req, res) => {
  const targetUrl = `http://eudora${req.originalUrl}`;
  console.log(`[DEBUG] Attempting to proxy request to: ${targetUrl}`);

  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      // Hapus header 'host' agar tidak mengganggu backend
      headers: { ...req.headers, host: null },
      responseType: 'stream',
      // Menambahkan timeout untuk memastikan request tidak menggantung selamanya
      timeout: 10000 // 10 detik
    });

    console.log(`[DEBUG] Proxy success. Status: ${response.status}`);
    res.status(response.status);
    response.data.pipe(res);

  } catch (error) {
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.error("!!!      MANUAL PROXY FAILED     !!!");
    console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    
    if (error.response) {
      console.error("[DEBUG] Backend responded with an error.");
      console.error("[DEBUG] Status:", error.response.status);
      res.status(502).send("Bad Gateway: Backend responded with an error.");
    } else if (error.request) {
      console.error("[DEBUG] No response from backend. Network error.");
      console.error("[DEBUG] Error Code:", error.code);
      console.error("[DEBUG] Destination:", error.config.url);
      res.status(504).send("Gateway Timeout: Could not connect to backend service.");
    } else {
      console.error("[DEBUG] Error setting up the proxy request:", error.message);
      res.status(500).send("Internal Server Error while setting up proxy.");
    }
  }
});

// Untuk sementara, kita hapus handler file statis dan fallback
// agar kita bisa fokus pada error proxy.
// app.use(express.static(path.join(__dirname, "dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

app.listen(PORT, () => {
  console.log(`[DEBUG] Server (debugging mode) running on port ${PORT}`);
});
