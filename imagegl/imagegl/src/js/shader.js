export const vshader = `
attribute vec2 offset;
varying vec2 vOffset;
void main() {
  vOffset = offset;
  gl_PointSize = 10.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}

`
export const fshader = `
uniform sampler2D texture;
uniform vec2 repeat;
varying vec2 vOffset;
void main() {
  vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );
  vec4 tex = texture2D( texture, uv * vec2( 128.0, 128.0 ) );
  // gl_FragColor = tex;
  gl_FragColor = vec4(uv, 0.0, 1.0);
}
`
