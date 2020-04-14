module.exports = function (grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: {
                    'assets/main.css': 'assets/scss/main.scss'
                }
            }
        },

        handlebars: {
            dev: {
                options: {
                    namespace: "grubforscrubs.templates",
                    processName: function (filePath) {
                        return filePath.replace(/^assets\/templates\//, '').replace(/\.hbs$/, '');
                    }
                },
                files: {
                    "assets/js/grubforscrubs/templates/templates.js": ["assets/templates/**/*.hbs"]
                }
            },
            dist: {
                options: {
                    namespace: "grubforscrubs.templates",
                    processName: function (filePath) {
                        return filePath.replace(/^assets\/templates\//, '').replace(/\.hbs$/, '');
                    }
                },
                files: {
                    "assets/js/grubforscrubs/templates/templates.js": ["assets/templates/**/*.hbs"]
                }
            }
        },

        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    'assets/main.min.css': 'assets/main.css'
                }
            }
        },

        concat: {
            dist: {
                files: {
                    'assets/app.js': ['assets/js/namespaces.js', 'assets/js/pledgeit/**/*.js', 'assets/js/grubforscrubs/**/*.js']
                }
            },
        },

        uglify: {
            build: {
                files: {
                    'assets/app.min.js': 'assets/app.js'
                }
            }
        },

        watch: {
            css: {
                files: 'assets/scss/**/*.scss',
                tasks: ['sass']
            },
            handlebars: {
                files: 'assets/templates/**/*.hbs',
                tasks: ['handlebars']
            },
            js: {
                files: 'assets/js/**/*.js',
                tasks: ['concat']
            }
        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    // ===========================================================================
    // CREATE TASKS ==============================================================
    // ===========================================================================
    grunt.registerTask('default', ['sass', 'handlebars', 'concat', 'watch']);
    grunt.registerTask('build', ['sass', 'handlebars', 'concat', 'cssmin', 'uglify']);
};
