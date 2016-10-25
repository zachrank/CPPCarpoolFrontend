module.exports = {

  options : {
    interrupt : true,
    forever   : true,
    spawn     : true
  },

  all     : {
    files : ['static/js/app/*.js', 'static/js/app/**/*.js', '!static/js/build/*.js'],
    tasks : ['build']
  },

  html : {
    files : ['static/index.html', 'static/partials/*.html', 'static/partials/**/*.html'],
    tasks : ['build']
  },

  css : {
    files : ['static/css/*.css', 'static/css/**/*.css', '!static/css/build/*.css'],
    tasks : ['build']
  }
};
