exports.getIndex = (req, res, next) => 
{
  res.render('index', {
      pageTitle: 'Search',
      path: '/',
      mus: [] //Placeholder to work with index.ejs
  });
};

exports.getLogin = (req, res, next) => 
{
  res.render('auth/login', {
      pageTitle: 'Login',
      path: '/views/auth/login',
  });
};

exports.getSignup = (req, res, next) => 
{
  res.render('auth/signup', {
      pageTitle: 'Sign Up page',
      path: '/views/auth/signup',
  });
};