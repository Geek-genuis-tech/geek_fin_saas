import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send("API Geek-Fin fonctionne !");
});

export default app;


