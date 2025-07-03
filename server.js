// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173; // Railway akan inject PORT ini

// Proxy requests to backend Laravel (yang pakai prefix /api/v1)
app.use("/api/v1", (req, res, next) => {
  console.log("🔥 Proxy request hit:", req.method, req.url);
  next();
});

app.use(
  "/api/v1",
  createProxyMiddleware({
    target: "http://eudora.railway.internal:8080", // Laravel running di port 8080
    changeOrigin: true,
    onProxyReq(proxyReq, req, res) {
      console.log("➡️ Forwarding to backend:", proxyReq.path);
    },
    onError(err, req, res) {
      console.error("❌ Proxy error:", err.message);
      res.status(500).send("Proxy error");
    },
  })
);

// Serve frontend build result
app.use(express.static(path.join(__dirname, "dist")));

// Fallback route untuk SPA (React Router)
app.get("*", (req, res) => {
  console.log("📦 Serving index.html for:", req.url);
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
});
