exports.getBasic = (req, res, next) => {
	console.log('Basic Controller Accessed');
  res.render('index', {
    path: '/',
    pageTitle: 'Blah'
  });
};
