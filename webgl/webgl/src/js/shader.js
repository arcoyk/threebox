export const vshader = `
attribute vec4 color;
varying vec4 varying_color;
uniform float r;
void main() {
  mat4 s = mat4(vec4(1.0, 0.0, 0.0, 0.0),
                vec4(0.0, 1.0, 0.0, 0.0),
                vec4(0.0, 0.0, 1.0, 0.0),
                vec4(0.0, 0.0, 0.0, 1.0));

  mat4 rot = mat4(vec4(cos(r), -sin(r), 0, 0),
                  vec4(sin(r),  cos(r), 0, 0),
                  vec4(     0,       0, 1, 0),
                  vec4(     0,       0, 0, 1));

  gl_Position = projectionMatrix * modelViewMatrix * rot * vec4(position, 1.0);
  varying_color = color;
}
`
export const fshader = `
varying vec4 varying_color;
void main() {
  gl_FragColor = varying_color;
}
`
