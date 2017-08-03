import * as React from 'react';

if(process.env && process.env['BROWSER'] && process.env['ENV'] !== 'production') {
    require('../../stylesheets/pacman.scss');
}

// So i need to save off moves before they actually occur. 

namespace Pacman {
    export interface State {
        x: number;
        y: number;
        direction: Direction
        nextDirection?: Direction
        score?: number;
    }

    export enum Direction {Up, Down, Left, Right}

    export type GridCell = "empty" | "wall" | "pellet" | "super-pellet";
}

export class PacmanGame extends React.Component<undefined, undefined> {
    public textInput: HTMLInputElement;
    public canvas: HTMLCanvasElement;

    // CONSTANTS
    private HEIGHT = 30;
    private WIDTH = 20;
    private SPRITE_SIZE = 20;
    private STEP = 5;
    private KEY_CODES = {
        LEFT: "37",
        RIGHT: "39",
        DOWN: "40",
        UP: "38"
    }

    // MEMBER VARIABLES
    private grid: Pacman.GridCell[][];
    private gameState: Pacman.State;

    constructor(props: any) {
        super(props);
        this.grid = [];
        setInterval(this.onTick, 100);
        for (let i = 0; i < this.HEIGHT; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.WIDTH; j++) {
                this.grid[i][j] = Math.random() > .8 ? "wall" : "pellet";
            }
        }

        this.gameState = {
            x: 0,
            y: 0,
            score: 0,
            direction: Pacman.Direction.Down,
            nextDirection: Pacman.Direction.Down
        };
    }

    private getPosition() {
        return {
            left: this.gameState.x + "px",
            top: this.gameState.y + "px"
        }
    }

    private isEmpty(x: number, y: number, direction: Pacman.Direction) {
        let i = Math.floor(y / this.SPRITE_SIZE); 
        let j = Math.floor(x / this.SPRITE_SIZE); 

        switch(direction) {
            case Pacman.Direction.Up:
                return i > 0 && this.grid[i - 1][j] !== "wall";
            case Pacman.Direction.Down:
                return i < this.HEIGHT && this.grid[i + 1][j] !== "wall";
            case Pacman.Direction.Left:
                return j > 0 && this.grid[i][j - 1] !== "wall";
            case Pacman.Direction.Right:
                return j < this.WIDTH && this.grid[i][j + 1] !== "wall";
        }
    }

    private isOnGrid() {
        switch(this.gameState.direction) {
            case Pacman.Direction.Up:
            case Pacman.Direction.Down:
                return this.gameState.y % this.SPRITE_SIZE == 0;

            case Pacman.Direction.Left:
            case Pacman.Direction.Right:
                return this.gameState.x % this.SPRITE_SIZE == 0;
        }
    }

    private nextMove = (): Pacman.State => {
        let { nextDirection, direction, x, y } = this.gameState;

        if(this.isOnGrid()) {
            if (nextDirection !== direction) {
                if (this.isEmpty(x, y, nextDirection)) {
                    direction = nextDirection;
                } else if (!this.isEmpty(x, y, direction)) {
                    return this.gameState;
                }
            } else {
                if(!this.isEmpty(x, y, direction)) {
                    return this.gameState;
                }
            }
        }
         
        switch(direction) {
            case Pacman.Direction.Down:
                if (y < (this.HEIGHT - 1) * this.SPRITE_SIZE) {
                    y += this.STEP;
                }
                break;
            case Pacman.Direction.Up:
                if (y > 0) {
                    y -= this.STEP;
                }
                break;
            case Pacman.Direction.Right:
                if (x < (this.WIDTH - 1) * this.SPRITE_SIZE) {
                    x += this.STEP;
                }
                break;
            case Pacman.Direction.Left:
                if (x > 0) {
                    x -= this.STEP;
                }
                break;
        }

        return { x, y, direction }
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
        this.clearPacman(this.gameState.x, this.gameState.y, ctx);

        this.gameState = Object.assign(this.gameState, this.nextMove());
        let i = this.gameState.y / this.SPRITE_SIZE, j = this.gameState.x / this.SPRITE_SIZE;
        if (this.gameState.x % this.SPRITE_SIZE === 0 && 
            this.gameState.y % this.SPRITE_SIZE === 0 &&
            this.grid[i][j] === "pellet") {
                this.gameState.score += 1;
                this.grid[i][j] = "empty";
        }

        this.drawScoreBoard(this.gameState.score, ctx);
        this.drawPacman(this.gameState.x, this.gameState.y, ctx);
    }

    private drawPacman(x: number, y: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(
            x + this.SPRITE_SIZE / 2, 
            y + this.SPRITE_SIZE / 2,
            this.SPRITE_SIZE / 2 - 2,
            0,
            Math.PI * 2,
            true
        );
        ctx.fill();
    }

    private drawPellet(i: number, j: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "brown";
        ctx.beginPath();
        ctx.arc(
            j * this.SPRITE_SIZE + this.SPRITE_SIZE / 2,
            i * this.SPRITE_SIZE + this.SPRITE_SIZE / 2,
            this.SPRITE_SIZE / 10,
            0, 
            Math.PI * 2,
            true
        );
        ctx.fill();
    }

    private drawWall(i: number, j: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
            j * this.SPRITE_SIZE, 
            i * this.SPRITE_SIZE,
            this.SPRITE_SIZE,
            this.SPRITE_SIZE
        )
    }

    private drawScoreBoard(score: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.fillRect(
            0, this.HEIGHT * this.SPRITE_SIZE, this.WIDTH * this.SPRITE_SIZE, 
            this.SPRITE_SIZE
        )

        ctx.fillStyle = "white";
        ctx.fillText(
            `Score: ${score}`,
            0, (this.HEIGHT + 1) * this.SPRITE_SIZE
        );
    }


    private clearPacman(x: number, y: number, ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, this.SPRITE_SIZE, this.SPRITE_SIZE);
    }

    public componentDidMount() {
        if(process.env && !process.env['BROWSER']) {
            return;
        }

        const ctx = this.canvas.getContext('2d');

        for(let i = 0; i < this.HEIGHT; i++) {
            for(let j = 0; j < this.WIDTH; j++) {
                switch(this.grid[i][j]) {
                    case "wall":
                        this.drawWall(i, j, ctx);
                        break;

                    case "pellet":
                        this.drawPellet(i, j, ctx);
                        break;
                }
            }
        }
    }

    public render() {
        return (
            <div className="pacman-container" onMouseUp = {this.handleClick}>
                <input 
                    ref = {i => {this.textInput = i}}
                    onKeyDown = {this.handleKeyDown}
                /> 
                <canvas 
                    ref = {i => {this.canvas = i}}
                    width = {this.WIDTH * this.SPRITE_SIZE}
                    height = {(this.HEIGHT + 1) * this.SPRITE_SIZE}
                ></canvas>
            </div>
        )
    }
}