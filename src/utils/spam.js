import { prisma } from '../config/prisma.js';

export async function computeSpamLikelihood(phone){
  const spamCount = await prisma.spamReport.count({ where: { phone } });
  const contactAppearances = await prisma.contact.count({ where: { phone } });
  const userExists = await prisma.user.count({ where: { phone } });
  const appearances = contactAppearances + (userExists > 0 ? 1 : 0);
  const denom = spamCount + appearances;
  const likelihood = denom === 0 ? 0 : spamCount / denom;
  return Number(likelihood.toFixed(3));
}
