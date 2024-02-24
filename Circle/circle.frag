precision mediump float;

// PI is not included by default in GLSL
#define M_PI 3.1415926535897932384626433832795

// Uniforms set from Javascript that are constant
// over all fragments
uniform float uTime; // Time elapsed since beginning of simulation
uniform float uRadius; // Radius of blob

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;

float offsetDistance(float sine, float cosine) {
    vec2 originOffset = vec2(2. * sine, 2. * cosine) * 0.3;
    vec2 offsetPosition = v_position - originOffset;
    float distanceFromOrigin = offsetPosition.x * offsetPosition.x + offsetPosition.y * offsetPosition.y;

    return distanceFromOrigin;
}

float distanceFromOrigin() {
    float distanceFromOrigin = v_position.x * v_position.x + v_position.y * v_position.y;
    return distanceFromOrigin;
}

vec4 skyColor(float cosine, float c) {
    vec4 skyColor;
    skyColor.r = 0.3 * (cosine + c);
    skyColor.g = 0.4 * (cosine + c);
    skyColor.b = 1. * (cosine + c + 0.1);
    skyColor.a = 1.;

    return skyColor;
}

vec4 sunColor(float cosine, float c) {
    vec4 sunColor;
    sunColor.r = 2. * (cosine + c);
    sunColor.g = 0.5 * (cosine + c);
    sunColor.b = -0.05 * (cosine - c);
    sunColor.a = 1.;

    return sunColor;
}

void main() {
    float cosine = cos(0.5*uTime);
    float sine = sin(0.5*uTime);
    float c = 1.;
    float dist = offsetDistance(sine, cosine);
    float gradientLimit = uRadius+0.6;

    // if(dist < uRadius*uRadius) {
    //     gl_FragColor = sunColor(cosine, c);
    // }
    // else if(dist < gradientLimit*gradientLimit) {
    //     float skyScalar = dist/(gradientLimit*gradientLimit);
    //     float sunScalar = 1. - skyScalar;

    //     gl_FragColor = skyColor(cosine, c) * skyScalar + sunColor(cosine, c) * sunScalar;
    // }
    // else {
    //     gl_FragColor = skyColor(cosine, c);
    // }

    // if(dist > gradientLimit*gradientLimit) {
    //     gl_FragColor = skyColor(cosine, c);
    // }
    // else {
    //     float skyScalar = dist/(gradientLimit*gradientLimit);
    //     float sunScalar = 1. - skyScalar;

    //     gl_FragColor = skyColor(cosine, c) * skyScalar + sunColor(cosine, c) * sunScalar;
    // }
    float skyScalar = dist/(gradientLimit*gradientLimit);
    float sunScalar = 1. - skyScalar;

    gl_FragColor = skyColor(cosine, c) * skyScalar + sunColor(cosine, c) * sunScalar;
}
