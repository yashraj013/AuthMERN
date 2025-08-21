import express from "express";
import { register, login, logout } from "../controllers/user.controllers.js";

export const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
