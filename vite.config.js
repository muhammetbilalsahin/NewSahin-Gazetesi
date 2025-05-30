import { defineConfig } from "vite";

export default defineConfig({
  base: "/NewSahin-Gazetesi",
  plugins: [vanilla()],
  server: {
    open: true, // Proje çalışınca tarayıcıda otomatik açılır
    port: 3000, // Geliştirme sunucusu portu
  },
  build: {
    outDir: "dist", // Üretim çıktılarının dizini
    emptyOutDir: true, // Derleme öncesinde klasörü temizler
  },
});
