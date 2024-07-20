const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

//config --> Important things
dotenv.config({ path: "backend/config/config.env" });
const PORT = process.env.PORT || 3000;

//database --> connecting Database
connectDatabase();

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});
