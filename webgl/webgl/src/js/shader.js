export const vshader = `
void main() {
  mat4 s = mat4(vec4(1.0, 0.0, 0.0, 0.0),
                vec4(0.0, 1.0, 0.0, 0.0),
                vec4(0.0, 0.0, 1.0, 0.0),
                vec4(0.0, 0.0, 0.0, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * s * vec4(position, 1.0);
}
`
export const fshader = `
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`
