const { Repository } = require('nodegit');
const fs = require('fs');

const hljs = require('highlight.js');

class ProjectEulerPlugin {
    constructor(repoPath) {
        this.apply.bind(this);
        this.addFile.bind(this);
        this.compile.bind(this);

        this.repoPath = repoPath;
        if (this.repoPath[this.repoPath.length - 1] !== '/') {
            this.repoPath += '/'
        }

        this.eulerPromise = this.compile(this.repoPath);
        this.eulerPromise.then(e => {
            this.cached = JSON.stringify(e);
        });
    }

    compile(repoPath) {
        var euler = {}
        return new Promise((res, rej) => {
            Repository.open(repoPath)
                .then(repo => repo.getMasterCommit())
                .then(commit => commit.getTree())
                .then(tree => {
                    var walker = tree.walk();

                    walker.on("entry", e => {
                        this.addFile(euler, repoPath + e.path());
                    });

                    walker.on("end", () => res(euler));
                    walker.on("err", e => rej(e));
                    walker.start();
                })
                .catch(err => rej(err))
                .done();
        });
    }

    addFile(euler, path) {
        const m = path.match(/.*?problem(.*)\.(.*)/);
        if (m !== null && path.indexOf('assets/') === -1) {
            let [prob, ext] = m.slice(1, 3);

            let code = fs.readFileSync(m[0]).toString();
            let { value } = hljs.highlight(ext, code);

            euler[prob] = euler[prob]
                ? [...euler[prob], { ext, code: value }]
                : [{ ext, code: value }];
        }
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, cb) => {
            this.eulerPromise.then(euler => {
                let eulerString = JSON.stringify(euler);
                compilation.assets['assets/euler.json'] = {
                    source: () => eulerString,
                    size: () => eulerString.length
                }
            }).catch(err => {
                compilation.errors.push(err);
            }).then(() => {
                cb();
            })
        });
    }
}

module.exports = ProjectEulerPlugin;