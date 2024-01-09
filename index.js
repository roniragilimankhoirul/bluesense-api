import { app } from "./src/application/app.js";
import "dotenv/config";

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Aplikasi Berjalan di http://localhost:${port}`);
});
