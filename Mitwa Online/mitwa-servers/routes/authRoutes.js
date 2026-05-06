import express from "express";
import { register, login, createStaff } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-staff", createStaff);

export default router;
