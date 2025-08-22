import { prisma } from '../config/prisma.js';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HttpError } from '../middlewares/error.js';

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    phone: z.string().min(7),
    password: z.string().min(6),
    email: z.string().email().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const loginSchema = z.object({
  body: z.object({
    phone: z.string().min(7),
    password: z.string().min(6)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const AuthSchemas = { registerSchema, loginSchema };

export async function register(req, res, next){
  try{
    const { name, phone, password, email } = req.body;
    const exists = await prisma.user.findUnique({ where: { phone } });
    if (exists) throw new HttpError(409, "Phone already registered");
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, phone, password: hashed, email }
    });
    res.status(201).json({ id: user.id, name: user.name, phone: user.phone, email: user.email });
  }catch(e){ next(e); }
}

export async function login(req, res, next){
  try{
    const { phone, password } = req.body;
    const user = await prisma.user.findUnique({ where: { phone } });
    if(!user) throw new HttpError(401, "Invalid credentials");
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) throw new HttpError(401, "Invalid credentials");
    const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  }catch(e){ next(e); }
}
