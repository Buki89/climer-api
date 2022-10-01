import express from "express";
import { rateLimiter } from "../controllers/rateLimiter";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  me,
} from "../controllers/authController";
import { validateForm } from "../controllers/validateForm";

export const router = express.Router();

router.route("/login").post(validateForm, rateLimiter(), handleLogin);

router.get("/me", me);

router.post("/signup", validateForm, handleRegister);

router.route("/logout").post(handleLogout);
