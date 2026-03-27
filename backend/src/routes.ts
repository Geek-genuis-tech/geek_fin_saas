// src/routes.ts

import { Router , Request, Response } from "express";
import userRoutes from "./modules/users/user.routes";


// Importation des routes modules !

// import authRoutes from "./modules/auth/auth.routes";
// import userRoutes from "./modules/users/user.routes";
// import budgetRoutes from "./modules/budget/budget.routes";

const router = Router();
router.use("/users", userRoutes);

// Définition des routes
// router.use("/auth", authRoutes);
// router.use("/users", userRoutes);
// router.use("/budget", budgetRoutes);

// Test route
router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "API OK !!" });
});

export default router;