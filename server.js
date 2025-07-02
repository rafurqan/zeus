// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Proxy middleware dengan konfigurasi yang aman
const proxyOptions = {
  target: "http://eudora.railway.internal:8080",
  changeOrigin: true,
  secure: false,
  logLevel: "info",
  onProxyReq: (proxyReq, req, res) => {
    console.log("➡️ Forwarding to backend:", proxyReq.path);
  },
  onError: (err, req, res) => {
    console.error("❌ Proxy error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Proxy error", message: err.message });
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log("✅ Response from backend:", proxyRes.statusCode);
  },
};

// Gunakan proxy middleware
app.use("/api/v1", createProxyMiddleware(proxyOptions));

// Add error handling middleware setelah routes
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  }
});

// Serve static files dengan path yang aman
const distPath = path.join(__dirname, "dist");
console.log("📁 Serving static files from:", distPath);

app.use(
  express.static(distPath, {
    maxAge: "1d",
    etag: false,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Fallback route untuk SPA dengan validasi path
app.get("*", (req, res) => {
  try {
    // Hindari path yang bermasalah
    if (req.url.includes("..") || req.url.includes("//")) {
      return res.status(400).send("Invalid path");
    }

    console.log("📦 Serving index.html for:", req.url);
    const indexPath = path.join(__dirname, "dist", "index.html");
    res.sendFile(indexPath);
  } catch (error) {
    console.error("Error serving index.html:", error);
    res.status(500).send("Error serving page");
  }
});

// Start server dengan error handling
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle server errors
server.on("error", (error) => {
  console.error("❌ Server error:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});
