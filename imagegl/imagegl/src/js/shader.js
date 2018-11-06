export const vshader = `
attribute vec3 trans;
void main() {
  // gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(position.x, position.y, 0.0, 0.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(trans + position, 1.0);
}

`
export const fshader = `
void main() {
  gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
}
`
