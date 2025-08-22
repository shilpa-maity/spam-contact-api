import { prisma } from '../config/prisma.js';
import { z } from 'zod';
import { HttpError } from '../middlewares/error.js';

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().nullable().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const UserSchemas = { updateSchema };

export async function getProfile(req, res, next){
  try{
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, phone: true, email: true, createdAt: true }
    });
    if(!user) throw new HttpError(404, "User not found");
    res.json(user);
  }catch(e){ next(e); }
}

export async function updateProfile(req, res, next){
  try{
    const { name, email } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { ...(name && { name }), ...(email !== undefined && { email }) },
      select: { id: true, name: true, phone: true, email: true }
    });
    res.json(updated);
  }catch(e){ next(e); }
}
