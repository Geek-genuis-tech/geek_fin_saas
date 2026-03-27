import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
