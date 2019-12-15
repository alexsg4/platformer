/* eslint-disable require-jsdoc */
class Vector2D {
  constructor(x = 0, y = 0) {
    this.x = typeof x === 'number' ? x : 0;
    this.y = typeof y === 'number' ? y : 0;
  }

  add(other) {
    if (!other instanceof Vector2D) {
      console.warn('Vector2D add: other argument is not a vector');
      return;
    }

    this.x += other.x;
    this.y += other.y;
  }

  scale(scalar) {
    if (typeof scalar != 'number') {
      console.warn('Vector2D scale: argument is not a number');
      return;
    }

    this.x *= scalar;
    this.y *= scalar;
  }

  dot(other) {
    if (!other instanceof Vector2D) {
      console.warn('Vector2D cross: other argument is not a vector');
      return;
    }

    return this.x * other.x + this.y * other.y;
  }

  length() {
    return Math.sqrt(this.dot(this));
  }
};

export default Vector2D;
