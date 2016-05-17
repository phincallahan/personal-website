module.exports = function(grunt) {
    marked = require('meta-marked');
    swig = require('swig');
    swig.setDefaults({ autoescape: false });
   
    grunt.registerTask('gen', 'Compiles static website', function() {
        var locals = new Object();
        locals.posts = mkposts();
        locals.solutions = mkprojecteuler();
        
        var index = swig.renderFile('src/views/home.html', locals);
        grunt.file.write('dist/index.html', index);
	});

    function mkprojecteuler() {
        var pattern = '[0-9]*'
        var paths = grunt.file.expand({cwd : 'content/project-euler'}, pattern);
        var solutions = paths.map(function(p) {
            var sol = {
                num : p,
                pos : "left: "+String(10*((Number(p)-1)%10))+"%;"+
                      "top: "+String(100*(Math.floor((Number(p)-1)/10)))+"%;"
            };
            return sol;
        });

        console.log(solutions);
        
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


