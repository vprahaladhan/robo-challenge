### ROBOT {number}

In 'ROBOT #num' directive, if such a robot doesn't exist, the directive is ignored and active robot remains the same as before.

### ASSUMPTION
It is assumed more than 1 robot can occupy a cell in the grid at one time. If we were to impose a condition that only 1 robot
can occupy a cell, then Grid class can be used to enforce that rule. In this case, Robot class's move method becomes:

  static move() {
    switch (this.active.direction.value) {
      case 'NORTH': 
        if (this.active.y < (n - 1) && !Grid.isOccupied(x, y + 1)) {
          this.active.y +=  1;
        }
        break;
      case 'WEST':  
        if (this.active.x > 0 && !Grid.isOccupied(x - 1, y)) {
          this.active.x -=  1;
        }
        break;
      case 'EAST':  
        if (this.active.x < (n - 1) && !Grid.isOccupied(x + 1, y)) {
          this.active.x +=  1;
        }
        break;
      case 'SOUTH': 
        if (this.active.y > 0 && !Grid.isOccupied(x, y - 1)) {
          this.active.y -=  1;
        }
    }
    Grid.occupy(this.active.x, this.active.y);
  }

and placeRobot method of Main class becomes:

  static placeRobot(position) {
    const [x, y, dir] = position.split(',');
    // to prevent robot being placed in a cell outside of the grid
    if (x >= 0 && x < n && y >= 0 && y < n && !Grid.isOccupied(x, y)) {
      new Robot(parseInt(x), parseInt(y), dir);
      placed = true;
    }
  }

### REVISED robo-challenge.js:
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
  static cells = [n - 1][n - 1];

  static occupy(x, y) {
    this.cells[x][y] = true;
  }

  static isOccupied(x, y) {
    return !!this.cells[x][y];
  }
}

// Main robot class with methods for the different operations
class Robot {
  static all = [];
  static count = 0;
  static active = null;

  constructor(x, y, direction) {
    this.name = `Robot ${Robot.all.length + 1}`;
    this.x = x;
    this.y = y;
    this.direction = directions.find(d => d.value === direction);
    Robot.all.push(this);
    Robot.count++;
    Robot.active = Robot.count === 1 ? this : Robot.active;
  }

  // method to make a robot active given a index
  static setActive(index) {
    this.active = index <= this.count ? this.all[index - 1] : this.active;
  }

  static report() {
    this.all.forEach(robot => console.log(`${robot.name}: ${robot.report()}`));
    console.log(`No of robots: ${this.all.length}, Active robot: ${this.active.name}`);
  }

  static left() {
    this.active.direction = directions[(this.active.direction.index + 3) % 4];
  }

  static right() {
    this.active.direction = directions[(this.active.direction.index + 1) % 4];
  }

  static move() {
    switch (this.active.direction.value) {
      case 'NORTH': 
        if (this.active.y < (n - 1) && !Grid.isOccupied(x, y + 1)) {
          this.active.y +=  1;
        }
        break;
      case 'WEST':  
        if (this.active.x > 0 && !Grid.isOccupied(x - 1, y)) {
          this.active.x -=  1;
        }
        break;
      case 'EAST':  
        if (this.active.x < (n - 1) && !Grid.isOccupied(x + 1, y)) {
          this.active.x +=  1;
        }
        break;
      case 'SOUTH': 
        if (this.active.y > 0 && !Grid.isOccupied(x, y - 1)) {
          this.active.y -=  1;
        }
    }
    Grid.occupy(this.active.x, this.active.y);
  }

  report() {
    return `${this.x},${this.y},${this.direction.value}`;
  }
}

class Main {
  static placeRobot(position) {
    const [x, y, dir] = position.split(',');
    // to prevent robot being placed in a cell outside of the grid
    if (x >= 0 && x < n && y >= 0 && y < n && !Grid.isOccupied(x, y)) {
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