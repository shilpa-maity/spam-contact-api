export function notFound(req, res, next){
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, req, res, next){
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
}

export class HttpError extends Error{
  constructor(status, message){
    super(message);
    this.status = status;
  }
}
