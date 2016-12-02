import * as Promise from 'bluebird';
import { readdir, stat, readFile, Stats } from 'fs';

const readdirAsync = Promise.promisify(readdir);
const statAsync  = Promise.promisify(stat);
const readFileAsync = Promise.promisify(readFile);
const isDirectoryAsync = (path: string | Buffer) => statAsync(path).then(stats => stats.isDirectory());

type EulerSolution = {
    ext: string;
    code: string;
};

type EulerProblem =  {
    id: number;
    solutions: EulerSolution[];
}

type Euler = {[id: number]: EulerProblem};

export class ProjectEulerModel {
    config: {
        path: string;
    }

    problems: Euler;

    constructor(config: {path: string}) {
        this.config = config;
        this.getProblems(config.path).then(problems => this.problems = problems).catch(console.log);
    }

    static getProblemId(problemDir: string): number {
        let match = problemDir.match(/(?:^|\/)(\d*)\/?$/);
        return match ? Number(match[1]) : 0;
    };

    static solutionRegex(problemId: number) {
        return new RegExp(`(?:^|/)problem${problemId}.([a-zA-z]*)$`);
    };

    private getProblems(path: string): Promise<{[id: string]: EulerProblem}> {
        return readdirAsync(path)
            .map<string, string>(file => path + file)
            .filter<string>(file => isDirectoryAsync(file))
            .then(dirs => {
                let problems: Promise<EulerProblem>[] = [];
                dirs.forEach( dir => {
                    let id = ProjectEulerModel.getProblemId(dir);
                    if(id > 0) {
                        let solutionPromise = this.getSolutions(dir, id)
                            .then<EulerProblem>(solutions => ({id, solutions}));
                        problems.push(solutionPromise);
                    }
                });

                return Promise.all(problems);
            }).then( solutions => solutions.reduce( (prev, curr) => {
                prev[curr.id] = curr;
                return prev
            }, {}));
    };

    private getSolutions(problemDir: string, problemId: number): Promise<EulerSolution[]> {
        const regex = ProjectEulerModel.solutionRegex(problemId);
        return readdirAsync(problemDir).filter<string>(f => regex.test(f))
            .map((path:string) => {
                return readFileAsync(problemDir + '/' + path)
                    .then(val => val.toString('utf-8'))
                    .then(contents => ({
                        ext: path.match(regex)[1],
                        code: contents
                    }));
            });
    };
}

export declare var ProjectEuler: ProjectEulerModel;