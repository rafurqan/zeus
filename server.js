// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

const isDevelopment = process.env.NODE_ENV === "development";
const isRailway = process.env.RAILWAY_ENVIRONMENT_NAME;

let BACKEND_URL;

if (isDevelopment) {
  BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
} else if (isRailway) {
  BACKEND_URL =
    process.env.BACKEND_URL ||
    process.env.LARAVEL_URL ||
    "https://eudora-production.up.railway.app";
} else {
  BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
}

console.log(
  "🌍 Environment:",
  isDevelopment ? "development" : isRailway ? "railway" : "production"
);
console.log("🎯 Backend target:", BACKEND_URL);

const proxyOptions = {
  target: BACKEND_URL,
  changeOrigin: true,
  secure: false,
  logLevel: "info",
  timeout: 30000,
  proxyTimeout: 30000,
  family: 4,
  headers: {
    Connection: "keep-alive",
    "X-Railway-Request": "true",
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log("➡️ Forwarding to backend:", `${BACKEND_URL}${proxyReq.path}`);

    if (isRailway) {
      proxyReq.setHeader("X-Forwarded-Proto", req.protocol);
      proxyReq.setHeader("X-Forwarded-Host", req.get("host"));
      proxyReq.setHeader("X-Railway-Internal", "true");
      proxyReq.setHeader("User-Agent", "Railway-Proxy-Agent");
    }
  },
  onError: (err, req, res) => {
    console.error("❌ Proxy error:", err.message);
    console.error("❌ Error code:", err.code);
    console.error("❌ Target was:", BACKEND_URL);
    console.error("❌ Request path:", req.path);

    if (err.code === "ECONNREFUSED") {
      console.error("🔍 Connection refused - possible causes:");
      console.error("   - Backend service not running");
      console.error("   - IPv6/IPv4 networking issue");
      console.error("   - Port mismatch");
      console.error("   - Private networking not fully propagated");
    }

    if (!res.headersSent) {
      let errorMessage = "Backend service unavailable";
      let statusCode = 502;

      if (err.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to backend service";
      } else if (err.code === "ETIMEDOUT") {
        errorMessage = "Backend service timeout";
        statusCode = 504;
      } else if (err.code === "ENOTFOUND") {
        errorMessage = "Backend hostname not found";
      }

      res.status(statusCode).json({
        error: errorMessage,
        code: err.code,
        target: BACKEND_URL,
        path: req.path,
        suggestion: isRailway
          ? "Check Railway private networking status and backend service health"
          : "Check if backend service is running locally",
        timestamp: new Date().toISOString(),
      });
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(
      "✅ Response from backend:",
      proxyRes.statusCode,
      `(${req.path})`
    );

    if (isRailway) {
      res.setHeader("X-Proxied-By", "Railway-Frontend");
      res.setHeader("X-Backend-Response-Time", new Date().toISOString());
    }
  },
};

app.use("/api/v1", createProxyMiddleware(proxyOptions));

app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  if (!res.headersSent) {
    res.status(500).send("Internal Server Error");
  }
});

const distPath = path.join(__dirname, "dist");
console.log("📁 Serving static files from:", distPath);

app.use(
  express.static(distPath, {
    maxAge: "1d",
    etag: false,
  })
);

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    port: PORT,
    backend_target: BACKEND_URL,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT_NAME: process.env.RAILWAY_ENVIRONMENT_NAME,
      isDevelopment,
      isRailway,
    },
  });
});

app.get("/test-backend", async (req, res) => {
  const testUrls = [
    BACKEND_URL, // Primary target
    "http://eudora.railway.internal:8080", // Explicit internal URL
    "https://eudora-production.up.railway.app", // Public URL fallback
    process.env.LARAVEL_PUBLIC_URL,
  ].filter(Boolean);

  const results = [];

  for (const url of testUrls) {
    try {
      const axios = (await import("axios")).default;
      const startTime = Date.now();

      const testEndpoint = url.includes("railway.app")
        ? "/api/v1/health"
        : "/api/v1/health";

      const response = await axios.get(`${url}${testEndpoint}`, {
        timeout: 10000,
        headers: {
          "User-Agent": "Railway-Frontend-Test",
          "X-Test-Request": "true",
        },
      });

      const responseTime = Date.now() - startTime;

      results.push({
        url,
        endpoint: testEndpoint,
        status: "success",
        http_status: response.status,
        response_time: `${responseTime}ms`,
        data: response.data,
      });

      console.log(`✅ Working backend URL found: ${url}`);
      break;
    } catch (error) {
      results.push({
        url,
        status: "failed",
        error: error.message,
        code: error.code,
        response_time: "timeout",
      });
    }
  }

  const hasWorkingUrl = results.some((r) => r.status === "success");

  res.json({
    timestamp: new Date().toISOString(),
    primary_target: BACKEND_URL,
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      RAILWAY_ENVIRONMENT_NAME: process.env.RAILWAY_ENVIRONMENT_NAME,
      isRailway,
    },
    test_results: results,
    status: hasWorkingUrl ? "success" : "all_failed",
    recommendation: hasWorkingUrl
      ? "At least one backend URL is working - consider updating BACKEND_URL env variable"
      : "All backend URLs failed - check Laravel service status in Railway",
  });
});

app.get("*", (req, res) => {
  try {
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
