import express from "express";
import { validateUser } from "../middleware/validation";
import { register, login } from "../controller/authController";
import { loginSchema, userSchema } from "../models/userModel";

export const routes = express.Router();

routes.post('/register', validateUser(userSchema), register);
routes.post('/login', validateUser(loginSchema), login);