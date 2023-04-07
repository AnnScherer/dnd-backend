import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://dnd-frontend-seven.vercel.app",
    credentials: true,
  })
);
app.use("/user", router);

mongoose.set("strictQuery", true);

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
  )
  .then(() => {
    console.log("Database Connected 😎");
  })
  .catch((err) => {
    console.log(err);
  });

// ----------------------------------------------------------
// Starte Server auf in der Config hinterlegtem Port
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on http://localhost:${process.env.PORT}`);
});
