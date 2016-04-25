define(function(require) {
  const dev_type = 'dev';
  var token;
  if (dev_type === 'dev') {
    token = localStorage.token;
  } else {
    token = PlugIn.getToken();
  }
  return {
    // host: "https://ncue-social-pl-bc-sakuxz.c9users.io:8080/",
    host: "https://sp.aliangliang.asia/",
    token: token,
    colorPattern: ['#C58F8F', '#0682E4', '#209C91', '#3AAF3F', '#FFA929', '#B17D6A', '#9E9E9E', '#698694']
  }
});
