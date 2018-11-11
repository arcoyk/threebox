export const vshader = `
attribute float mindex;
uniform vec3 cameraUp;
attribute vec3 move;

struct Transform
{
  vec4 position;
  vec4 axis_angle;
};
uniform Transform T;

vec4 quat_from_axis_angle(vec3 axis, float angle)
{ 
  vec4 qr;
  // float half_angle = (angle * 0.5) * 3.14159 / 180.0;
  float half_angle = angle / 2.0;
  qr.x = axis.x * sin(half_angle);
  qr.y = axis.y * sin(half_angle);
  qr.z = axis.z * sin(half_angle);
  qr.w = cos(half_angle);
  return qr;
}

vec4 quat_conj(vec4 q)
{ 
  return vec4(-q.x, -q.y, -q.z, q.w); 
}
  
vec4 quat_mult(vec4 q1, vec4 q2)
{ 
  vec4 qr;
  qr.x = (q1.w * q2.x) + (q1.x * q2.w) + (q1.y * q2.z) - (q1.z * q2.y);
  qr.y = (q1.w * q2.y) - (q1.x * q2.z) + (q1.y * q2.w) + (q1.z * q2.x);
  qr.z = (q1.w * q2.z) + (q1.x * q2.y) - (q1.y * q2.x) + (q1.z * q2.w);
  qr.w = (q1.w * q2.w) - (q1.x * q2.x) - (q1.y * q2.y) - (q1.z * q2.z);
  return qr;
}

vec3 rotate_vertex_position(vec3 position, vec3 axis, float angle)
{ 
  vec4 qr = quat_from_axis_angle(axis, angle);
  vec4 qr_conj = quat_conj(qr);
  vec4 q_pos = vec4(position.x, position.y, position.z, 0);
  
  vec4 q_tmp = quat_mult(qr, q_pos);
  qr = quat_mult(q_tmp, qr_conj);
  
  return vec3(qr.x, qr.y, qr.z);
}

void main() {
  vec3 v1 = normalize( cameraUp );
  vec3 v2 = normalize( cameraPosition );
  vec3 v3 = rotate_vertex_position( v2, v1, 3.14 / 2.0 );
  v1 /= 10.0;
  v2 /= 10.0;
  v3 /= 10.0;
  // float theta = acos( dot( v1, v2 ) ); 
  // vec3 axis = cross( v1, vec3( v2 );
  // vec3 p = rotate_vertex_position( position, axis, theta );
  // vec3 p = rotate_vertex_position( position, axis, theta );
  float s = 1.0;
  vec3 p = position;
  if ( mod(mindex, 4.0) == 0.0 ) {
    // p = vec3(0.0,   s, 0.0);
    p = v1;
  } else if ( mod(mindex, 4.0) == 1.0) {
    // p = vec3(  s,   s, 0.0);
    p = v1 + v3;
  } else if ( mod(mindex, 4.0) == 2.0) {
    // p = vec3(  s, 0.0, 0.0);
    p = v3;
  } else {
    p = vec3(0.0, 0.0, 0.0);
  }
  p = p + move;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( p, 1.0 );
}

`
export const fshader = `
void main() {
  gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
}
`
