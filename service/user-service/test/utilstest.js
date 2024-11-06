import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
export class UserUtils {
  static async delete() {
    await prisma.user.deleteMany({
      where: {
        email: "test@example.com"
      }
    });
  }

  static async create() {
    const token = jwt.sign(
      { email: "test" },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await prisma.user.create({
      data: {
        name: "test",
        email: "test@example.com",
        password: await bcrypt.hash("secret1234", 10),
      }
    });
  }
};