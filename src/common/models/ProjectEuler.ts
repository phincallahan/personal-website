import { 
    readdirSync as readdir,
    readFileSync as readFile, 
} from 'fs';

export namespace Euler {
    export type Solution = {
        ext: string;
        code: string;
    };

    export type Map = {[id: number]: Solution[]};

    export function getSolutions(path: string) {
        const reg = `^problem([0-9]+)\.([a-zA-z]+)$`;
        let matches = readdir(path)
            .map(f => f.match(reg))
            .filter(f => f!)

        let solutions: Map = {};
        matches.forEach(m => {
            let solution = { 
                ext: m[2],
                code: readFile(path + m.input).toString() 
            }

            if (solutions[m[1]]) {
                solutions[m[1]].push(solution)
            } else {
                solutions[m[1]] = [solution]
            }
        });

        return solutions;
    };
}