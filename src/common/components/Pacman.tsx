import * as React from 'react';

if(process.env && process.env['BROWSER'] && process.env['ENV'] !== 'production') {
    require('../../stylesheets/pacman.scss');
}

//A character class can choose it's on direction 


// PACMAN CHARACTER CLASS. 
// ON EVERY TICK THERE IS 

namespace Pacman {
    export interface State {
        i: number;
        j: number;
        k: number;
        direction: Direction
        nextDirection?: Direction
        score?: number;
    }

    export enum Direction {Up, Down, Left, Right}

    export type GridCell = "e" | "w" | "p" | "sp";
}

export class PacmanGame extends React.Component<undefined, undefined> {
    public textInput: HTMLInputElement;
    public canvas: HTMLCanvasElement;

    // CONSTANTS

    // TO-DO: MOVE PACMAN GRID INTO JSON FILE
    private grid: Pacman.GridCell[][] = 
    [
        ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "w"],
        ["w", "p", "w", "w", "w", "w", "p", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "sp", "w", "w", "w", "w", "p", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p"],
        ["w", "p", "w", "w", "w", "w", "p", "w", "w", "p", "w", "w", "w", "w"],
        ["w", "p", "w", "w", "w", "w", "p", "w", "w", "p", "w", "w", "w", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "w", "w", "p", "p", "p", "p", "w"],
        ["w", "w", "w", "w", "w", "w", "p", "w", "w", "w", "w", "w", "e", "w"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "w", "w", "w", "e", "w"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "e", "w", "w", "w", "w"],
        ["w", "w", "w", "w", "w", "w", "p", "w", "w", "e", "w", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "e", "p", "e", "e", "e", "w", "e", "e", "e"],
        ["w", "w", "w", "w", "w", "w", "p", "w", "w", "e", "w", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "e", "w", "w", "w", "w"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "e", "e", "e", "e", "e"],
        ["e", "e", "e", "e", "e", "w", "p", "w", "w", "e", "w", "w", "w", "w"],
        ["w", "w", "w", "w", "w", "w", "p", "w", "w", "e", "w", "w", "w", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "w"],
        ["w", "p", "w", "w", "w", "w", "p", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "p", "w", "w", "w", "w", "p", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "sp", "p", "p", "w", "w", "p", "p", "p", "p", "p", "p", "p", "e"],
        ["w", "w", "w", "p", "w", "w", "p", "w", "w", "p", "w", "w", "w", "w"],
        ["w", "w", "w", "p", "w", "w", "p", "w", "w", "p", "w", "w", "w", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "w", "w", "p", "p", "p", "p", "w"],
        ["w", "p", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "p", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "p", "w"],
        ["w", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p", "p"],
        ["w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w", "w"],
    ];

    private HEIGHT: number;
    private WIDTH: number;
    private TILE_SIZE = 20;
    private STEP = 2;
    private KEY_CODES = {
        LEFT: "37",
        RIGHT: "39",
        DOWN: "40",
        UP: "38"
    }
    private PELLET_COUNT: number;
    private ON_TICK_ID: number;

    // MEMBER VARIABLES
    private gameState: Pacman.State;

    constructor(props: any) {
        super(props);

        for (let i = 0; i < this.grid.length; i++) {
            let tmp = this.grid[i].slice();
            this.grid[i] = this.grid[i].concat(tmp.reverse());
            for (let p of this.grid[i]) {
                this.PELLET_COUNT += p === "p" ? 1 : 0;
            }
        }

        this.HEIGHT = this.grid.length;
        this.WIDTH = this.grid[0].length

        this.gameState = {
            i: 1,
            j: 1,
            k: 0,
            score: 0,
            direction: Pacman.Direction.Down,
            nextDirection: Pacman.Direction.Down
        };
    }

    private getPosition() {
        return {
            left: this.gameState.i + "px",
            top: this.gameState.j + "px"
        }
    }

    private isEmpty(i: number, j: number, direction: Pacman.Direction) {
        switch(direction) {
            case Pacman.Direction.Up:
                return i > 0 && this.grid[i - 1][j] !== "w";
            case Pacman.Direction.Down:
                return i < this.HEIGHT && this.grid[i + 1][j] !== "w";
            case Pacman.Direction.Left:
                return j > 0 && this.grid[i][j - 1] !== "w";
            case Pacman.Direction.Right:
                return j < this.WIDTH && this.grid[i][j + 1] !== "w";
        }
    }

    private nextMove = (): Pacman.State => {
        let { nextDirection, direction, i, j, k } = this.gameState;

        if (k == 0) {
            if (nextDirection !== direction) {
                if (this.isEmpty(i, j, nextDirection)) {
                    direction = nextDirection;
                } else if (!this.isEmpty(i, j, direction)) {
                    return this.gameState;
                }
            } else {
                if(!this.isEmpty(i, j, direction)) {
                    return this.gameState;
                }
            }
        }
         
        switch(direction) {
            case Pacman.Direction.Down:
                if (i < (this.HEIGHT - 1) * this.TILE_SIZE) {
                    k += this.STEP;
                }

                if (k >= this.TILE_SIZE) {
                    i += 1;
                    k -= this.TILE_SIZE;
                }
                break;

            case Pacman.Direction.Up:
                if (i > 0) {
                    k -= this.STEP;
                }

                if (k < 0) {
                    i -= 1;
                    k += this.TILE_SIZE;
                }
                break;

            case Pacman.Direction.Right:
                if (j < (this.WIDTH - 1) * this.TILE_SIZE) {
                    k += this.STEP;
                }

                if (k >= this.TILE_SIZE) {
                    j += 1;
                    k -= this.TILE_SIZE;
                }
                break;

            case Pacman.Direction.Left:
                if (j > 0) {
                    k -= this.STEP;
                }

                if (k < 0) {
                    j -= 1;
                    k += this.TILE_SIZE;
                }
                break;
        }

        return { i, j, k, direction }
    }

    handleClick = (event: React.MouseEvent<HTMLDivElement>) => { this.textInput.focus(); }
    handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch(event.keyCode.toString()) {
            case this.KEY_CODES.RIGHT: 
                this.gameState.nextDirection = Pacman.Direction.Right;
                if(this.gameState.direction === Pacman.Direction.Left) {
                    this.gameState.direction = Pacman.Direction.Right;
                }
                break;
            case this.KEY_CODES.LEFT:  
                this.gameState.nextDirection = Pacman.Direction.Left;
                if(this.gameState.direction === Pacman.Direction.Right) {
                    this.gameState.direction = Pacman.Direction.Left;
                }
                break;
            case this.KEY_CODES.DOWN:  
                this.gameState.nextDirection = Pacman.Direction.Down;
                if(this.gameState.direction === Pacman.Direction.Up) {
                    this.gameState.direction = Pacman.Direction.Down;
                }
                break;
            case this.KEY_CODES.UP:    
                this.gameState.nextDirection = Pacman.Direction.Up;
                if(this.gameState.direction === Pacman.Direction.Down) {
                    this.gameState.direction = Pacman.Direction.Up;
                }
                break;
        }
    }

    private onTick = () => {
        if (!this.canvas) {
            return;
        }

        const ctx = this.canvas.getContext('2d');
        let { i, j, k } = this.gameState;

        this.gameState = Object.assign(this.gameState, this.nextMove());
        if (this.grid[this.gameState.i][this.gameState.j] === "p") {
            this.gameState.score++;
            this.PELLET_COUNT--;
            this.grid[this.gameState.i][this.gameState.j] = "e";
        }

        this.clearPacman(i, j, k, ctx);
        this.drawScoreBoard(this.gameState.score, ctx);
        this.drawPacman(ctx);

        if (this.PELLET_COUNT === 0) {
            window.clearInterval(this.ON_TICK_ID);
        }
    }

    private drawPacman(ctx: CanvasRenderingContext2D) {
        let {i, j, k} = this.gameState;

        let x = j * this.TILE_SIZE + this.TILE_SIZE / 2;
        let y = i * this.TILE_SIZE + this.TILE_SIZE / 2;

        switch (this.gameState.direction) {
            case Pacman.Direction.Up:
            case Pacman.Direction.Down:
                y += k;
                break;
            
            case Pacman.Direction.Left:
            case Pacman.Direction.Right:
                x += k;
                break;
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(x, y, this.TILE_SIZE / 2 - 2, 0, 2 * Math.PI, true);
        ctx.fill();
    }

    private drawPellet(i: number, j: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "tan";
        ctx.beginPath();
        ctx.arc(
            j * this.TILE_SIZE + this.TILE_SIZE / 2,
            i * this.TILE_SIZE + this.TILE_SIZE / 2,
            this.TILE_SIZE / 10,
            0, 
            Math.PI * 2,
            true
        );
        ctx.fill();
    }

    private drawSuperPellet(i: number, j: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(
            j * this.TILE_SIZE + this.TILE_SIZE / 2,
            i * this.TILE_SIZE + this.TILE_SIZE / 2,
            this.TILE_SIZE / 5,
            0, 
            Math.PI * 2,
            true
        );
        ctx.fill();
    }

    private drawWall(i: number, j: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
            j * this.TILE_SIZE, 
            i * this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE
        )
    }

    private drawScoreBoard(score: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0, this.HEIGHT * this.TILE_SIZE, this.WIDTH * this.TILE_SIZE, 
            this.TILE_SIZE
        )

        ctx.fillStyle = "white";
        ctx.fillText(
            `Score: ${score}`,
            0, (this.HEIGHT + 1) * this.TILE_SIZE
        );
    }

    private clearPacman(i: number, j: number, k: number, ctx: CanvasRenderingContext2D) {
        // let {i, j, k} = this.gameState;

        let x = j * this.TILE_SIZE;
        let y = i * this.TILE_SIZE;
        switch (this.gameState.direction) {
            case Pacman.Direction.Up:
            case Pacman.Direction.Down:
                y += k;
                break;
            
            case Pacman.Direction.Left:
            case Pacman.Direction.Right:
                x += k;
                break;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
    }

    public componentDidMount() {
        if(process.env && !process.env['BROWSER']) {
            return;
        }

        const ctx = this.canvas.getContext('2d');
        for(let i = 0; i < this.HEIGHT; i++) {
            for(let j = 0; j < this.WIDTH; j++) {
                switch(this.grid[i][j]) {
                    case "w":
                        this.drawWall(i, j, ctx);
                        break;

                    case "p":
                        this.drawPellet(i, j, ctx);
                        break;
                    
                    case "sp":
                        this.drawSuperPellet(i, j, ctx);
                }
            }
        }

        this.ON_TICK_ID = window.setInterval(this.onTick, 30);
    }

    public render() {
        return (
            <div className="pacman-container" 
                 onMouseUp = {this.handleClick}
                 style = {{
                     height: this.HEIGHT * this.TILE_SIZE,
                     width: this.WIDTH * this.TILE_SIZE
                 }}
                 >
                <input 
                    ref = {i => {this.textInput = i}}
                    onKeyDown = {this.handleKeyDown}
                /> 
                <canvas 
                    ref = {i => {this.canvas = i}}
                    width = {this.WIDTH * this.TILE_SIZE}
                    height = {(this.HEIGHT + 1) * this.TILE_SIZE}
                ></canvas>
            </div>
        )
    }
}