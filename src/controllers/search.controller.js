import { prisma } from '../config/prisma.js';
import { z } from 'zod';
import { computeSpamLikelihood } from '../utils/spam.js';

const nameSearchSchema = z.object({
  query: z.object({ query: z.string().min(1) }),
  params: z.object({}).optional(),
  body: z.object({}).optional()
});

const phoneSearchSchema = z.object({
  params: z.object({ number: z.string().min(5) }),
  query: z.object({}).optional(),
  body: z.object({}).optional()
});

export const SearchSchemas = { nameSearchSchema, phoneSearchSchema };

export async function searchByName(req, res, next){
  try{
    const q = req.query.query.toLowerCase();

    // Users
    const users = await prisma.user.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      select: { id: true, name: true, phone: true }
    });

    // Contacts
    const contacts = await prisma.contact.findMany({
      where: { name: { contains: q, mode: 'insensitive' } },
      select: { id: true, name: true, phone: true }
    });

    // Merge into results with origin info
    const all = [
      ...users.map(u => ({ origin: 'registered', id: u.id, name: u.name, phone: u.phone })),
      ...contacts.map(c => ({ origin: 'contact', id: c.id, name: c.name, phone: c.phone }))
    ];

    // Ranking: startsWith first, then contains
    const startsWith = [];
    const contains = [];
    for (const r of all){
      if (r.name.toLowerCase().startsWith(q)) startsWith.push(r);
      else contains.push(r);
    }
    const ranked = [...startsWith, ...contains];

    // Add spamLikelihood
    const withSpam = [];
    for (const r of ranked){
      const likelihood = await computeSpamLikelihood(r.phone);
      withSpam.push({ ...r, spamLikelihood: likelihood });
    }

    res.json(withSpam);
  }catch(e){ next(e); }
}

export async function searchByPhone(req, res, next){
  try{
    const number = req.params.number;

    // If registered user exists -> only that result
    const user = await prisma.user.findUnique({
      where: { phone: number },
      select: { id: true, name: true, phone: true }
    });
    const likelihood = await computeSpamLikelihood(number);

    if (user){
      return res.json([{ origin: 'registered', id: user.id, name: user.name, phone: user.phone, spamLikelihood: likelihood }]);
    }

    // else find all contacts with that exact number
    const contacts = await prisma.contact.findMany({
      where: { phone: number },
      select: { id: true, name: true, phone: true }
    });

    const results = contacts.map(c => ({ origin: 'contact', id: c.id, name: c.name, phone: c.phone, spamLikelihood: likelihood }));
    res.json(results);
  }catch(e){ next(e); }
}

export async function getRegisteredDetails(req, res, next){
  try{
    const userId = Number(req.params.userId);
    const person = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, phone: true, email: true }
    });
    if (!person) return res.status(404).json({ error: "Not found" });

    const likelihood = await computeSpamLikelihood(person.phone);

    // Only show email if requester is in person's contact list
    const inContacts = await prisma.contact.count({
      where: { ownerId: userId, phone: req.user.phone }
    }) > 0;

    const dto = { id: person.id, name: person.name, phone: person.phone, spamLikelihood: likelihood };
    if (inContacts && person.email) dto.email = person.email;
    res.json(dto);
  }catch(e){ next(e); }
}

export async function getContactDetails(req, res, next){
  try{
    const contactId = Number(req.params.contactId);
    const c = await prisma.contact.findUnique({
      where: { id: contactId },
      select: { id: true, name: true, phone: true }
    });
    if (!c) return res.status(404).json({ error: "Not found" });
    const likelihood = await computeSpamLikelihood(c.phone);
    res.json({ ...c, spamLikelihood: likelihood });
  }catch(e){ next(e); }
}
