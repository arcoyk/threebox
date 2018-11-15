export const vshader = `
attribute vec2 offset;
varying vec2 vOffset;
void main() {
  vOffset = offset;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = 4500.0 * ( 1.0 / ( -mvPosition.z ) );
  gl_Position = projectionMatrix * mvPosition;
}

`
export const fshader = `
uniform sampler2D texture;
uniform vec2 repeat;
varying vec2 vOffset;
void main() {
  vec2 uv = vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y );
  vec4 tex = texture2D( texture, uv * vec2( 0.1, 0.1 ) + vOffset );
  gl_FragColor = tex;
  // gl_FragColor = vec4(uv, 0.0, 1.0);
}
`
