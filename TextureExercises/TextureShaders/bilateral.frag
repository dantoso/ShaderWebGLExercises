precision mediump float;

const float BLUR_SUPPORT = 0.05;
const float BLUR_INC = 0.005;

// The 2D position of the pixel in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying vec2 v_position;
// The 2D texture coordinate in this fragment, interpolated via
// barycentric coordinates from positions of triangle vertices
varying highp vec2 v_texture;

uniform sampler2D uSampler;

uniform float uSigmar;
uniform float uSigmad;

/**
 * Compute the intensity of a color pixel
 * @param rgba The red, green, blue, alpha describing the pixel
 */
float getIntensity(vec4 rgba) {
    return 0.2125*rgba.r + 0.7154*rgba.g + 0.0721*rgba.b;
}

vec4 testHorizontal(sampler2D sample, vec2 position) {
    float diff = uSigmad;
    vec4 pixel = 2. * texture2D(sample, position);
    for(float i = -1.; i<=1.; i+=2.) {
        pixel -= texture2D(sample, vec2(position.x + i*diff, position.y));
    }
    pixel.a = 1.;

    return pixel;
}

vec4 testVertical(sampler2D sample, vec2 position) {
    float diff = uSigmad;
    vec4 pixel = 2. * texture2D(sample, position);
    for(float i = -1.; i<=1.; i+=2.) {
        pixel -= texture2D(sample, vec2(position.x, position.y + i*diff));
    }
    pixel.a = 1.;

    return pixel;
}

vec4 testDiagonals(sampler2D sample, vec2 position) {
    float diff = uSigmad;
    vec4 pixel = 4. * texture2D(sample, position);
    for(float i = -1.; i<=1.; i+=2.) {
        for(float j = -1.; j<=1.; j+=2.) {
            pixel -= texture2D(sample, vec2(position.x + i*diff, position.y + j*diff));
        }
    }
    pixel.a = 1.;

    return pixel;
}

vec4 blur(sampler2D sample, vec2 position) {
    vec4 pixel = texture2D(sample, position);
    float counter = 0.;

    for (float dx = -BLUR_SUPPORT; dx <= BLUR_SUPPORT; dx += BLUR_INC) {
        for (float dy = -BLUR_SUPPORT; dy <= BLUR_SUPPORT; dy += BLUR_INC) {
            float x = position.x + dx;
            float y = position.y + dy;
            vec4 modifier = texture2D(sample, vec2(x, y));

            pixel += modifier;
            counter++;
        }
    }

    pixel /= counter;
    pixel.a = 1.;

    return pixel;
}

vec4 controllableBlur(sampler2D sample, vec2 position) {
    vec4 pixel = texture2D(sample, position);
    float counter = 1.;

    for (float dx = -BLUR_SUPPORT; dx <= BLUR_SUPPORT; dx += BLUR_INC) {
        for (float dy = -BLUR_SUPPORT; dy <= BLUR_SUPPORT; dy += BLUR_INC) {
            float x = position.x + dx;
            float y = position.y + dy;
            vec2 modPos = vec2(x, y);
            
            float distanceSqr = dot(modPos - position, modPos - position);
            float modW = exp(-distanceSqr/(BLUR_SUPPORT*BLUR_SUPPORT*uSigmar));

            vec4 modifier = texture2D(sample, modPos);
            pixel += modifier*modW;
            counter += modW;
        }
    }
    pixel /= counter;
    pixel.a = 1.;

    return pixel;
}

vec4 bilateralFilter(sampler2D sample, vec2 position) {
    vec4 pixel = texture2D(sample, position);
    vec4 modPixel = vec4(0., 0., 0., 1.);
    float counter = 0.;

    for (float dx = -BLUR_SUPPORT; dx <= BLUR_SUPPORT; dx += BLUR_INC) {
        for (float dy = -BLUR_SUPPORT; dy <= BLUR_SUPPORT; dy += BLUR_INC) {
            float x = position.x + dx;
            float y = position.y + dy;
            vec2 modPos = vec2(x, y);
            
            float distanceSqr = dot(modPos - position, modPos - position);
            float blurW = exp(-distanceSqr/(2.*uSigmad*uSigmad));

            vec4 modifier = texture2D(sample, modPos);
            float rgbDistSqr = dot(pixel - modifier, pixel - modifier);
            float rgbDistW = exp(-rgbDistSqr/(2.*uSigmar*uSigmar));

            float modW = rgbDistW * blurW;
            modPixel += modifier*modW;
            counter += modW;
        }
    }
    modPixel /= counter;
    modPixel.a = 1.;

    return modPixel;
}

void main() {
    float x1 = v_texture.x;
    float y1 = v_texture.y;

    gl_FragColor = bilateralFilter(uSampler, vec2(x1, y1));

    // vec4 laplacePixel = testDiagonals(uSampler, v_texture);

    // gl_FragColor = blur(uSampler, v_texture);

    // gl_FragColor = laplacePixel;

    // float gray = getIntensity(gl_FragColor);
    // gl_FragColor = vec4(gray, gray, gray, 1.);

    // if(getIntensity(laplacePixel) < uSigmar) {
    //    gl_FragColor = blur(uSampler, v_texture);
    // }
   
    gl_FragColor.a = 1.0;
}
