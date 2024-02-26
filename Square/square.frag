precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795
#define squareColor vec4(0.8, 0.3, 0.3, 1.)

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uHalfSideLen; // Half of the side length

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

vec4 drawSquare(float halfSide, vec2 originOffset, vec2 position) {
    vec2 offset = position - originOffset;
    float halfSideSqr = halfSide*halfSide;
    if(offset.x*offset.x < halfSideSqr && offset.y*offset.y < halfSideSqr) {
        return squareColor;
    }

    return vec4(0.0, 0.0, 0.0, 1.0);
}

float calculateReflection(float rayComponent, float rayDirection) {
    float integer = floor(abs(rayComponent));
    float fraction = rayComponent - integer;
    float modulo4 = mod(integer, 4.);

    if(integer == 0.) {
        return rayComponent;
    }

    if(modulo4 == 1. || modulo4 == 2.) {
        return (1. - fraction)*sign(rayDirection);   
    }

    return (-1. + fraction)*sign(rayDirection);
}

vec2 moveOrigin(float scalar, vec2 direction) {
    vec2 origin = vec2(0., 0.);
    vec2 offset = scalar * direction;

    origin.x = calculateReflection(offset.x, direction.x);
    origin.y = calculateReflection(offset.y, direction.y);

    return origin;
}

void main() {
    vec2 direction = vec2(1.,0.);
    vec2 offset = moveOrigin(0.2*uTime, direction);
    
    gl_FragColor = drawSquare(uHalfSideLen, offset, v_position);
}
