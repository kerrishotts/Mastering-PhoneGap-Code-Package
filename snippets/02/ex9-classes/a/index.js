class Point{
  constructor(x=0, y=0) {
    [this._x, this._y] = [x, y];
  }

  get x() { return this._x; }
  set x(x) { this._x = x; }
  get y() { return this._y; }
  set y(y) { this._y = y; }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
  copy() {
    return new Point(this.x, this.y);
  }
  equal(p) {
    return (p.x === this.x) && (p.y === this.y);
  }
}

class Size extends Point {
  constructor( w=0, h=0) {
    super(w,h);
  }
  get w() {return this.x;}
  set w(w) {this.x = w;}
  get h() {return this.y;}
  set h(h) {this.h = h;}
  copy() {
    return new Size(this.w, this.h);
  }
}

class Rectangle{
  constructor(origin=(new Point(0,0)), size=(new Size(0,0))) {
    [this._origin, this.size] = [origin.copy(), size.copy()];
  }
  get origin() { return this._origin; }
  set origin(origin) { this._origin = origin.copy(); }
  get size() { return this._size; }
  set size(size) { this._size = size.copy(); }
  copy() {
    return new Rectangle(this.origin, this.size);
  }
  toString() {
    return `${this.origin}:${this.size}`;
  }
  equal(r) {
    return this.origin.equal(r.origin) && this.size.equal(r.size);
  }
  equalSize(r) {
    return this.size.equal(r.size);
  }
}

let pointA = new Point(10, 50);
let sizeA = new Size(25, 50);
let rectA = new Rectangle(pointA, sizeA);
console.log(`${rectA}`); // (10, 50):(25, 50)

