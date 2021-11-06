exports.getBasic = (req, res, next) => {
	console.log('Basic Controller Accessed');
  res.render('basic', {
    path: '/basic',
    pageTitle: 'Blah'
  });
};
