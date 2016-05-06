path = require('path');
fs = require('fs')
fm = require('front-matter');
marked = require('marked');
swig = require('swig');
swig.setDefaults({ autoescape: false });

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

        clean : {
            options: {
                force: true
            },
            js: ["dist/assets/js/*.js"],
            css: ["dist/assets/css/*.css"],
            posts: ["dist/posts/**"]
        },

		sass: {
			dev: {
				files: {
					'dist/assets/css/blog.css' : 'src/scss/blog.scss',
                    'dist/assets/css/home.css' : 'src/scss/home.scss',
				}
			}
		},

		postcss: {
			options: {
				map: true, 
				processors: [
					require('autoprefixer')({
						browsers: ['last 2 versions']
					})
				]
			},

			dev: {
				src: 'dist/assets/css/*.css'
			}
		},

		browserify: {
			dev: {
				files: {
					'dist/assets/js/bundle.js' : 'src/js/main.js'
				}
			}
		},

		watch: {
			js: {
				files: 'src/js/*.js',
				tasks: ['browserify']
			},
			
			sass: {
				files: 'src/scss/*.scss',
				tasks: ['stylesheets']
			}	

		},

		browserSync: {
			dev: {
				bsFiles: {
					src: ['dist/assets/**/*', 'src/views/*.jade']
				}, 

				options: {
					proxy: 'localhost:3000',
					watchTask: true
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('static_gen', 'Compiles static website', function() {
        var p_path = __dirname+'/src/posts';

        function getPostAttributes(post) {
            var attr = new Object();
            attr.date = new Date(post.attributes.date.split(' ')); 
            attr.title = post.attributes.title;
            attr.datestring = attr.date.getMonth()+'/'+attr.date.getYear();
            attr.path = attr.date.getYear()+'/' +
                        attr.date.getMonth() + '/' +
                        attr.date.getDay() + '/' + 
                        attr.title.replace(' ', '-').toLowerCase();
            attr.url = 'blog/'+attr.path;
            return attr;
        }

        function ensureDirectory(p) {
            try {
                fs.statSync(path.dirname(p));
            }
            catch (e) {
                console.log(p);
                ensureDirectory(path.dirname(p));
            }  

            fs.mkdirSync(p);
        }

        var paths = (fs.readdirSync(p_path)).filter(function(p) {
            return !p.startsWith('.');
        });

        var posts = paths.map(function(p) {
            var f_path = p_path+'/'+p;

            var post = fm(fs.readFileSync(f_path, 'utf8'));
            post.attributes = getPostAttributes(post);
            post.body = marked(post.body);

            return post;
        });

        var blogtpl = swig.compileFile("src/views/blog.html");
        posts.forEach(function(p) {
            var o_path = __dirname+'/dist/posts/'+p.attributes.path+'.html';
            ensureDirectory(path.dirname(o_path));
            
            var post = blogtpl({ post : p });
            fs.writeFileSync(o_path, post);
        });

        var locals = new Object();
        locals.posts = posts.map(function(p) { return p.attributes; });
        
        var index = swig.renderFile('src/views/home.html', locals);
        fs.writeFile(__dirname+'/dist/index.html', index);
	});

	grunt.registerTask('stylesheets', ['sass', 'postcss']);
    grunt.registerTask('build', ['clean', 'static_gen', 'stylesheets', 'browserify']);
	grunt.registerTask('default', ['build', 'browserSync', 'watch']);

}

