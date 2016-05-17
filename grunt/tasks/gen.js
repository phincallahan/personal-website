module.exports = function(grunt) {
    marked = require('meta-marked');
    swig = require('swig');
    swig.setDefaults({ autoescape: false });
   
    grunt.registerTask('gen', 'Compiles static website', function() {
        var locals = new Object();
        locals.posts = mkposts();
        grunt.file.write('dist/assets/euler.json', JSON.stringify(mkprojecteuler()));
        
        var index = swig.renderFile('src/views/home.html', locals);
        grunt.file.write('dist/index.html', index);
	});

    function mkprojecteuler() {
        var info = grunt.file.readJSON('content/project-euler/info.json');
        var meta = info['meta'];
        var pattern = '[0-9]*';

        var paths = grunt.file.expand({cwd : 'content/project-euler'}, pattern);
        var solutions = paths.map(function(p) {
            var id = Number(p);
            if(info.solved.indexOf(id)) {
                info.solved.splice(info.solved.indexOf(id), 1);
            }

            var sol = {
                number : p,
                difficulty : meta[id]['difficulty'],
                title : meta[id]['title']
            };
            return sol;
        });
        
        solutions = solutions.concat(info.solved.map(function(p) {
            var id = Number(p);
            var sol = {
                number : p,
                difficulty : meta[id]['difficulty'],
                title : meta[id]['title']
            };
            return sol;
        }));

        return solutions;
    }

    function mkposts() {
        var meta = Array();
        var blogtpl = swig.compileFile("src/views/blog.html");

        var posts = grunt.file.recurse('content/posts', function(path) {
            var post = marked(grunt.file.read(path));
            var path = 'dist/posts/'+p.meta.title+'.html';
            grunt.file.write(path, blogtpl({ post : p }));
            meta.append(post);
        });
        
        return meta;
    }
};


