precision highp float;

// The maximum number of iterations before escape should be
// included here (You can change this)
#define MAX_ITERS 200.0
#define GREEN vec4(0.2, 0.7, 0.2, 1.);
#define PURPLE vec4(0.6, 0., 0.8, 1.);

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

vec4 greenToBlack(vec2 start, float escape) {
    vec2 z = start;
    vec4 green = GREEN;
    for(float i = 0.; i < MAX_ITERS; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.*z.x*z.y) + uC;

        if(dot(z, z) > escape*escape) {
            vec4 color = green*i/MAX_ITERS;
            color.a = 1.;
            return color;
        }
    }
    return green;
}

vec4 greenToPurpleToGreen(vec2 start, float escape) {
    vec2 z = start;
    vec4 green = GREEN;
    vec4 purple = PURPLE;

    for(float i = 0.; i < MAX_ITERS; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.*z.x*z.y) + uC;

        if(dot(z, z) > escape*escape) {
            float pW = i/MAX_ITERS;
            if(pW < 0.1) {
                return green*0.1;
            }
            vec4 color = purple*pW;
            color.a = 1.;
            return color;
        }
    }
    return green;
}

void main() {
    vec2 z = uScale*v_position - uCenter;

    gl_FragColor = greenToPurpleToGreen(z, uEscape);
}
