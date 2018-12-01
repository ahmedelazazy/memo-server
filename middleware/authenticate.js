module.exports = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return next();
    }

    var userId = req.header('x-auth');
    if (!userId) {
      throw new Error('Unauthorized');
    }

    req.userId = userId;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
