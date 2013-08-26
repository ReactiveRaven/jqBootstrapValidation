/*global module:false*/
module.exports = function(grunt) {
    
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
      component: {
        name: '<%= pkg.name %>',
        version: '<%= pkg.version %>',
        main: ['./dist/<%= pkg.name %>-<%= pkg.version %>.min.js'],
        dependencies: {
          jquery: '*'
        }
      },
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta.banner %>',
          stripBanners: true
        },
        files: {
          'dist/<%= pkg.name %>-<%= pkg.version %>.js': 'src/<%= pkg.name %>.js'
        }
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta.banner %>',
        },
        files: {
          'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
        }
      }
    },
    qunit: {
      local: ['test/notravis/**/*.html'],
      travis: ['test/issues/**/*.html', 'test/jqBootstrapValidation.html']
    },
    watch: {
      files: '<%= jshint.files %>',
      tasks: ['jshint', 'qunit']
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
        browser: true,
        globals: {
          jQuery: true
        },
      },
      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    compress: {
      dist: {
        options: {
          archive: 'dist/<%= pkg.name %>.zip'
        },
        expand: true,
        src: 'dist/*.js',
        flatten: true
      }
    },
    clean: {
      folder: "dist/"
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify', 'compress']);
  
  // Travis CI task.
  grunt.registerTask('travis', ['jshint', 'qunit:travis']);

  grunt.registerTask('component', 'Buld component.json', function () {
    var opts = grunt.config('meta.component');

    grunt.file.write('component.json', JSON.stringify(opts, true, 2) + '\n');
  });

};
