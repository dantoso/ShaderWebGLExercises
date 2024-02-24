precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 100.0

// Uniforms set from Javascript that are constant
// over all fragments
uniform vec2 uCenter; // Where the origin (0, 0) is on the canvas
uniform vec2 uC; // z -> z^2 + uC
uniform float uScale; // Scale of fractal
uniform float uEscape; // Escape distance
uniform vec3 uPows; /* Final color will be R = uPows.x^(-count/MAX_ITERS)
                    *                      G = uPows.y^(-count/MAX_ITERS)
                    *                      B = uPows.z^(-count/MAX_ITERS) */

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

void main() {
    vec2 z = uScale*v_position - uCenter;
    vec4 green = vec4(0.2, 1., 0.2, 1.);
    vec4 orange = vec4(1., 0.6, 0., 1.);

    for(float i = 0.; i < MAX_ITERS; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.*z.x*z.y) + uC;

        if(dot(z, z) > uEscape*uEscape) {
            gl_FragColor = green*i/MAX_ITERS;
            gl_FragColor.a = 1.;
            return;
        }
    }
    gl_FragColor = green;
}
