exports.getIndex = (req, res, next) => 
{
  res.render('index', {
      pageTitle: 'Search',
      path: '/',
      mus: [] //Placeholder to work with index.ejs
  });
};