module.exports = function(grunt) {
    var marked = require('meta-marked');
    marked.setOptions({
        highlight: function (code) {
            return require('highlight.js').highlightAuto(code).value;
        }
    });

    var swig = require('swig');
    swig.setDefaults({ autoescape: false });
    
    var cache = require(__dirname+'/cache.js')(grunt);

    grunt.registerTask('gen', 'Compiles static website', function() {
        var target = {
            path : {
                blog : "content/posts/",
                euler : "content/project-euler/"
            }
        };

        var functs = [getProblems, getCodeSnippets, filterUnsolved, getPosts];
        for(var i = 0; i < functs.length; i++) {
            target = functs[i](target);
        }

        var index = swig.renderFile('src/views/home.html', target);
        grunt.file.write('dist/index.html', index);
	});

    function filterUnsolved(target) {
        var solutions = [];

        target.euler.forEach(function(item) {
            if (item.solved) {
                solutions.push(item);
            }
        });
        target.euler = solutions;

        return target;
    }

    function getCodeSnippets(target) {
        var folder = grunt.file.expand({cwd: target.path.euler}, '[0-9]*');
        for(var i = 0; i < folder.length; i++) {
            var num = folder[i];
            var problem = target.euler.get(num);

            problem.snippets = [];
            problem.solved = true;

            var path = target.path.euler + num;
            grunt.file.recurse(path, function (abspath, rootdir, subdir, filename) {
                if(!filename.includes(".") || filename.startsWith("."))
                    return;

                grunt.log.writeln("processing: "+filename);
                if(cache.has(abspath)) {
                    grunt.log.writeln("\tretrieving cache");
                    problem.snippets.push(cache.get(abspath));
                }
                else {
                    grunt.log.writeln("\tproducing html");
                    var snippet = "";
                    snippet += "```"+filename.split(".")[1]+"\n";
                    snippet += grunt.file.read(abspath, {encoding : 'utf-8'});
                    snippet += "```\n";
                    snippet = marked(snippet).html;

                    grunt.log.writeln("\tcaching: "+filename);
                    cache.put(abspath, snippet);
                    problem.snippets.push(snippet);
                }
            });
        }

        return target;
    }

    function getProblems(target) {
        var problems = grunt.file.readJSON(target.path.euler+'/info.json');

        target.euler = new Map();
        for(var i = 0; i < problems.length; i++) {
            target.euler.set(problems[i].number, problems[i]);
        }

        return target;
    }

    function getPosts(target) {
        target.posts = [];
        return target;
    }
};


