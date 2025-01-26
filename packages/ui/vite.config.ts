import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			// Target is your backend API
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, ""),

				configure: (proxy, _options) => {
					proxy.on("error", (err, _req, _res) => {
						console.log("error", err);
					});
					proxy.on("proxyReq", (_proxyReq, req, _res) => {
						console.log("Request sent to target:", req.method, req.url);
					});
					proxy.on("proxyRes", (proxyRes, req, _res) => {
						console.log(
							"Response received from target:",
							proxyRes.statusCode,
							req.url,
						);
					});
				},
			},
		},
	},
});
