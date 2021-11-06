exports.getIndex = (req, res, next) => 
{
  res.render('tuner/search', {
      pageTitle: 'Search',
      path: '/'
  });
};