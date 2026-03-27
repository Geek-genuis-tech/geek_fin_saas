import { Router } from "express";
import { register, login } from "./auth.service";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const result = await register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: "Erreur création utilisateur", err });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await login(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    res.json(user); // plus tard, renvoyer JWT
  } catch (err) {
    res.status(500).json({ message: "Erreur login", err });
  }
});

export default router;