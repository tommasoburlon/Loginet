class vec2{
  constructor(_x = 0.0, _y = 0.0){
    this.x = _x;
    this.y = _y;
  }
  len(){
    return VMath.norm(this)
  }
  copy(vec){ this.x = vec.x; this.y = vec.y; }
  add(vec){ this.x += vec.x; this.y += vec.y; }
  sub(vec){ this.x -= vec.x; this.y -= vec.y; }
  mul(k){ this.x *= k; this.y *= k; }
  normalize(){ this.mul(1 / this.len()) }
}

class V2Math{
  static add(v1, v2){ return new vec2(v1.x + v2.x, v1.y + v2.y); }
  static sub(v1, v2){ return new vec2(v1.x - v2.x, v1.y - v2.y); }
  static mul(a, v1 ){ return new vec2(a * v1.x, a * v1.y); }
  static dot(v1, v2){ return v1.x * v2.x + v1.y * v2.y; }
  static norm(v1){ return Math.sqrt(this.dot(v1, v1)); }
  static normalize(v1){ return this.mul(1 / this.norm(v1), v1); }
  static distance(v1, v2){ return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y)); }
}
