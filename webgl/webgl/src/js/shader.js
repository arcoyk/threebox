export const vshader = `
		void main() {

			// vec3 look = normalize( cameraPosition - position );

        	// if( length( look ) == 0.0 ) {
		    //     look.z = 1.0;
	        // }

			// vec3 up = vec3( 0.0, 1.0, 0.0 );
			// vec3 right = normalize( cross( up, look ) );
			// up = normalize( cross( look, right ) );


			// mat4 transformMatrix;

			// transformMatrix[0][0] = right.x;
			// transformMatrix[0][1] = right.y;
			// transformMatrix[0][2] = right.z;

			// transformMatrix[1][0] = up.x;
			// transformMatrix[1][1] = up.y;
			// transformMatrix[1][2] = up.z;

			// transformMatrix[2][0] = look.x;
			// transformMatrix[2][1] = look.y;
			// transformMatrix[2][2] = look.z;

			// gl_Position = projectionMatrix * modelViewMatrix * transformMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(position.x, position.y, 0.0, 0.0));
		}
`
export const fshader = `
		void main() {
			gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );
		}
`
