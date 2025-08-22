import jwt from 'jsonwebtoken';
import { HttpError } from './error.js';

export function authRequired(req, res, next){
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if(!token) return next(new HttpError(401, "Unauthorized"));
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, phone: payload.phone };
    next();
  }catch(e){
    next(new HttpError(401, "Invalid token"));
  }
}
