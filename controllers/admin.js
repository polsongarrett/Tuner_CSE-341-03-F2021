exports.getUserProfile = (req, res, next) => 
{
  res.render('admin/user-profile', {
      pageTitle: 'Profile',
      path: '/views/admin/user-profile',
      // Obvious placeholder code...
      musician: {
        name: "Bill"
      }
  });
};
