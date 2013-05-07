/*global module:false*/
module.exports = function(grunt) {
    
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-clean');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */',
      componentjson: '{\n  "name": "<%= pkg.name %>",\n  "version": "<%= pkg.version %>",\n  "main": ["./dist/<%= pkg.name %>-<%= pkg.version %>.min.js"],\n  "dependencies": {\n    "jquery": "*"\n  }\n}'
    },
    concat: {
      dist: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      },
      componentjson: {
        src: ['<banner:meta.componentjson>'],
        dest: 'component.json'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
      }
    },
    qunit: {
      local: ['test/notravis/**/*.html'],
      travis: ['test/issues/**/*.html', 'test/jqBootstrapValidation.html']
    },
    lint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    uglify: {},
    zip: {
      // We accept short syntax
      // 'destinationZip': ['firstFileToZip', 'secondFileToZip', ...]
      'dist/jqBootstrapValidation.zip': 'dist/*.js'
    },
    clean: {
      folder: "dist/"
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint qunit clean concat min zip');
  
  // Travis CI task.
  grunt.registerTask('travis', 'lint qunit:travis');

};
