const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handeling uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Server is Down : Becuause - ${err.message} `);
  process.exit(1);
});

//config --> Important things
dotenv.config({ path: "backend/config/config.env" });
const PORT = process.env.PORT || 3000;

//database --> connecting Database
connectDatabase();

const server = app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}`);
});

//Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Server is Down Due to :- ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
