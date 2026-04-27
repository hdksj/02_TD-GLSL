// --- ノイズ基盤 ---
float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(hash(i),              hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

// fbm: ノイズを5層重ねてスケール感を出す
float fbm(vec2 p) {
    float val = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
        val += amp * noise(p);
        p   *= 2.0;
        amp *= 0.5;
    }
    return val;
}

// --- メイン ---
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uStrength;

out vec4 fragColor;

void main() {
    vec2 uv = vUV.st;
    float t  = uTime * uSpeed;

    vec2 q = vec2(
        fbm(uv * uScale + vec2(0.00, 0.00) + t),
        fbm(uv * uScale + vec2(5.20, 1.30) + t)
    );

    vec2 r = vec2(
        fbm(uv * uScale + uStrength * q + vec2(1.70, 9.20) + t * 1.1),
        fbm(uv * uScale + uStrength * q + vec2(8.30, 2.80) + t * 1.1)
    );

    // 第3層：rを使ってさらにワープ
    vec2 s = vec2(
        fbm(uv * uScale + uStrength * r + vec2(3.10, 4.50) + t * 1.2),
        fbm(uv * uScale + uStrength * r + vec2(6.70, 0.90) + t * 1.2)
    );

    // clampで端を元画像のエッジピクセルで埋める
    vec2 warpedUV = clamp(uv + uStrength * (s - 0.5), 0.0, 1.0);
    vec4 col      = texture(sTD2DInputs[0], warpedUV);

    fragColor = TDOutputSwizzle(col);
}