import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const FIRST = ["Anu","Anupama","Riya","Raj","Rahul","Suman","Sneha","Arjun","Neha","Karan","Pooja","Dev"];
const LAST = ["K","M","S","T","Gupta","Sharma","Patel","Singh","Roy","Das","Ghosh"];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function phone(){ return "9" + Math.floor(100000000 + Math.random()*899999999); }

async function main(){
  // clean
  await prisma.spamReport.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // users
  const users = [];
  for(let i=0;i<30;i++){
    const name = rand(FIRST) + " " + rand(LAST);
    const ph = phone();
    const email = Math.random() > 0.5 ? name.toLowerCase().replace(/\s+/g,'.') + "@mail.com" : null;
    const password = await bcrypt.hash("password123", 10);
    const u = await prisma.user.create({
      data: { name, phone: ph, email, password }
    });
    users.push(u);
  }

  // contacts for each user
  for (const u of users){
    const numContacts = 15 + Math.floor(Math.random()*15);
    for(let i=0;i<numContacts;i++){
      const name = rand(FIRST) + " " + rand(LAST);
      const ph = Math.random() < 0.3 ? rand(users).phone : phone(); // some overlap with registered users
      await prisma.contact.create({
        data: { name, phone: ph, ownerId: u.id }
      });
    }
  }

  // spam reports
  for (const u of users){
    const reports = 5 + Math.floor(Math.random()*10);
    for(let i=0;i<reports;i++){
      const ph = Math.random() < 0.5 ? rand(users).phone : phone();
      try{
        await prisma.spamReport.create({
          data: { phone: ph, userId: u.id }
        });
      }catch(e){ /* unique per user+phone */ }
    }
  }

  console.log("Seed done. Users:", users.length);
}

main().catch(e=>{console.error(e)}).finally(()=>prisma.$disconnect());
