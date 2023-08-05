
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
  }

  exports.checkAuth = checkAuth
