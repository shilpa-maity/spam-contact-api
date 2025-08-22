import { prisma } from '../config/prisma.js';
import { z } from 'zod';

const spamSchema = z.object({
  params: z.object({ phone: z.string().min(5) }),
  query: z.object({}).optional(),
  body: z.object({}).optional()
});

export const SpamSchemas = { spamSchema };

export async function markSpam(req, res, next){
  try{
    const phone = req.params.phone;
    // create unique (phone, userId)
    await prisma.spamReport.upsert({
      where: { phone_userId: { phone, userId: req.user.id } },
      update: {}, // idempotent
      create: { phone, userId: req.user.id }
    });
    res.json({ success: true, phone });
  }catch(e){ next(e); }
}
