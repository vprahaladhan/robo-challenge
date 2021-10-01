const fs = require('fs').promises;

// For a grid of 5 x 5 units, can be changed to any +ve int > 0; 
// no exhaustive testing done for high values
const n = 5;

// flag to indicate if the first robot has been placed on the grid.
// until it is true, other instructions are ignored
let placed = false;

const directions = [
  { index: 0, value: 'NORTH' },
  { index: 1, value: 'EAST' },
  { index: 2, value: 'SOUTH' },
  { index: 3, value: 'WEST' }
];


// class Grid to show if cells have been occupied or not. 
// assumption is to not allow movement to a cell which is already occupied
// feature has not been implemented in this iteration, probably for next iteration
class Grid {
  static #cells = [n - 1][n - 1];

  static occupy(x, y) {
    this.#cells[x][y] = true;
  }

  static isOccupied(x, y) {
    return !!this.#cells[x][y];
  }
}

// Main robot class with methods for the different operations
class Robot {
  static #all = [];
  static #active = null;

  constructor(x, y, direction) {
    this.name = `Robot ${Robot.#all.length + 1}`;
    this.x = x;
    this.y = y;
    this.direction = directions.find(d => d.value === direction);
    Robot.#all.push(this);
    Robot.#active = Robot.#all.length === 1 ? this : Robot.#active;
  }

  // method to make a robot active given a index
  static setActive(index) {
    this.#active = index <= this.#all.length ? this.#all[index - 1] : this.#active;
  }

  static report() {
    this.#all.forEach(robot => console.log(`${robot.name}: ${robot.report()}`));
    console.log(`No of robots: ${this.#all.length}, Active robot: ${this.#active.name}`);
  }

  static left() {
    this.#active.direction = directions[(this.#active.direction.index + 3) % 4];
  }

  static right() {
    this.#active.direction = directions[(this.#active.direction.index + 1) % 4];
  }

  static move() {
    switch (this.#active.direction.value) {
      case 'NORTH': this.#active.y = this.#active.y < (n - 1) ? this.#active.y + 1 : this.#active.y; break;
      case 'WEST':  this.#active.x = this.#active.x > 0 ? this.#active.x - 1 : this.#active.x; break;
      case 'EAST':  this.#active.x = this.#active.x < (n - 1) ? this.#active.x + 1 : this.#active.x; break;
      case 'SOUTH': this.#active.y = this.#active.y > 0 ? this.#active.y - 1 : this.#active.y; break;
    }
  }

  report() {
    return `${this.x},${this.y},${this.direction.value}`;
  }
}

class Main {
  static placeRobot(position) {
    const [x, y, dir] = position.split(',');
    // to prevent robot being placed in a cell outside of the grid
    if (x, y >= 0 && x, y < n) {
      new Robot(parseInt(x), parseInt(y), dir);
      placed = true;
    }
  }

  static processInstructions(instructions) {
    instructions.forEach(ins => {
      const [command, position] = ins.split(' ');

      if (placed) {
        switch (command) {
          case 'LEFT':    Robot.left(); break;
          case 'RIGHT':   Robot.right(); break;
          case 'MOVE':    Robot.move(); break;
          case 'ROBOT':   Robot.setActive(parseInt(position)); break;
          case 'REPORT':  Robot.report(); break;
          case 'PLACE':   this.placeRobot(position);
        }
      }
      else {
        if (command === 'PLACE') {
          this.placeRobot(position);
        } 
      }
    });
  }

  static async readFile(filePath) {
    try {
      const instructions = (await fs.readFile(filePath)).toString().split('\r\n');
      this.processInstructions(instructions);
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  }
}

Main.readFile('test.txt');