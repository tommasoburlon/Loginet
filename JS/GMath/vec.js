let VMath = {
  addv3 : function(vec1, vec2){ return new vec3(vec1.x + vec2.x, vec1.y + vec2.y, vec1.z + vec2.z); },
  dotv3 : function(vec1, vec2){ return vec1.x * vec2.x + vec1.y * vec2.y + vec1.z * vec2.z; },
  subv3 : function(vec1, vec2){ return new vec3(vec1.x - vec2.x, vec1.y - vec2.y, vec1.z - vec2.z); },
  mulv3 : function(a, vec){ return new vec3(a * vec.x, a * vec.y, a * vec.z); },
};

class vec3{
  constructor(_x = 0.0, _y = 0.0, _z = 0.0){
    this.x = _x;
    this.y = _y;
    this.z = _z;
  }
  len(){
    return Math.sqrt(VMath.dotv3(this, this));
  }
}
