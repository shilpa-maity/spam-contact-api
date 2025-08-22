export const validate =
  (schema) =>
  (req, res, next) => {
    const data = { body: req.body, params: req.params, query: req.query };
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten() });
    }
    // replace with parsed data (optional)
    req.body = parsed.data.body;
    req.params = parsed.data.params;
    req.query = parsed.data.query;
    next();
  };
