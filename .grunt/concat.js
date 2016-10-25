module.exports = {

  options : {
    separator : '\n\n'
  },

  app    : {
    src  : [
      './static/js/app/**/**/*.js',
      './static/js/app/**/*.js',
      './static/js/app/*.js',
      '<%= ngtemplates.cppcarpool.dest %>'
    ],
    dest : './static/js/build/app.build.js'
  },

  vendor : {
    src  : [
      './static/js/vendor/**/*.js',
      './static/js/vendor/*.js'
    ],
    dest : './static/js/build/app.vendor.build.js'
  },

  css    : {
    src  : [
      './static/css/app/**/*.css',
      './static/css/app/*.css',
    ],
    dest : './static/css/build/cppcarpool.css'
  }

};
