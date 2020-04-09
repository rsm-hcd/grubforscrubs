module.exports = function (grunt) {

    // ===========================================================================
    // CONFIGURE GRUNT ===========================================================
    // ===========================================================================
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: {
                    'styles/main.css': 'styles/scss/main.scss'
                }
            }
        },

        handlebars: {
            dev: {
                options: {
                    namespace: "grubforscrubs.templates",
                    processName: function (filePath) {
                        return filePath.replace(/^templates\//, '').replace(/\.hbs$/, '');
                    }
                },
                files: {
                    "js/grubforscrubs/templates/templates.js": ["templates/**/*.hbs"]
                }
            },
            dist: {
                options: {
                    namespace: "grubforscrubs.templates",
                    processName: function (filePath) {
                        return filePath.replace(/^templates\//, '').replace(/\.hbs$/, '');
                    }
                },
                files: {
                    "js/grubforscrubs/templates/templates.js": ["templates/**/*.hbs"]
                }
            }
        },

        cssmin: {
            options: {
                banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
            },
            build: {
                files: {
                    '/assets/css/app.min.css': '/assets/css/app.css'
                }
            }
        },

        concat: {
            dist: {
                files: {
                    'app.js': ['js/namespaces.js', 'js/**/*.js']
                }
            },
        },

        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            },
            handlebars: {
                files: 'templates/**/*.hbs',
                tasks: ['handlebars']
            },
            js: {
                files: 'js/**/*.js',
                tasks: ['concat']
            }
        }

    });

    // ===========================================================================
    // LOAD GRUNT PLUGINS ========================================================
    // ===========================================================================
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-handlebars');

    // ===========================================================================
    // CREATE TASKS ==============================================================
    // ===========================================================================
    grunt.registerTask('default', ['sass', 'handlebars', 'concat', 'watch']);
    grunt.registerTask('build', ['sass', 'handlebars', 'concat']);

};
