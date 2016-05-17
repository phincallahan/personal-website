module.exports = function(grunt) {
    /**
    fs = require('fs')
    fm = require('front-matter');
    marked = require('marked');
    swig = require('swig');
    swig.setDefaults({ autoescape: false });
    path = require('path');
    **/
   
    grunt.registerTask('static-gen', 'Compiles static website', function() {
        console.log("hey");
        /**
        var locals = new Object();
        locals.posts = mkposts(__dirname+'/content/posts');
        locals.solutions = mkprojecteuler(__dirname+'/content/project-euler');
        
        var index = swig.renderFile('src/views/home.html', locals);
        fs.writeFile(__dirname+'/dist/index.html', index);
       **/
	});

    /**
    function mkprojecteuler(euler_path) {
        var paths = (fs.readdirSync(euler_path)).filter(function(p) {
            return !p.includes('.');
        });

        var solutions = paths.map(function(p) {
            var sol = {
                num : p,
                pos : "left: "+String(10*((Number(p)-1)%10))+"%;"+
                      "top: "+String(100*(Math.floor((Number(p)-1)/10)))+"%;"
            };
            return sol;
        });
        
        return solutions;
    }

    function mkposts(p_path) {
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
            post.attr = getPostAttributes(post);
            post.body = marked(post.body);

            return post;
        });
        
        var blogtpl = swig.compileFile("src/views/blog.html");
        posts.forEach(function(p) { 
            var o_path = __dirname+'/dist/posts/'+p.attr.title+'.html';
            ensureDirectory(path.dirname(o_path));
            
            var post = blogtpl({ post : p });
            fs.writeFileSync(o_path, post);
        });
       
        return posts.map(function(p) { return p.attributes; });
    }
   **/
};


