function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    return next();
    }
    res.redirect('/login');
    }
   app.get('/protected', ensureAuthenticated, (req, res) => {
    res.send('This is a protected route');
    });