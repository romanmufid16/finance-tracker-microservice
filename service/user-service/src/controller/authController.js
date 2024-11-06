import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkEmail = await prisma.user.findUnique({
      where: {
        email: email
      }
    });

    if (checkEmail) {
      return res.status(400).json({
        error: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword
      }
    });
    res.status(201).json({
      message: "Register Success",
      data: {
        name: response.name,
        email: response.email
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: { email: email}
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(200).json({
      message: 'Login success',
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};