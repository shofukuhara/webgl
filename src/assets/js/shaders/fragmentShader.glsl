precision mediump float;

uniform vec2 u_resolution;  // 画面解像度
uniform float u_time;       // 経過時間

// 簡単なノイズ生成関数
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 2Dノイズを生成
float perlinNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // ノイズの計算を行う
    float a = noise(i);
    float b = noise(i + vec2(1.0, .0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    // スムーズな補間
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    // 色の生成（よりコントラストのある色合い）
    vec3 color1 = vec3(0.0, 0.5, 0.8);
    vec3 color2 = vec3(0.0, 0.8, 1.0);
    vec3 color3 = vec3(0.0, 0.502, 1.0);
    vec3 color4 = vec3(0.1686, 0.0, 1.0);

    // 各色のノイズを生成し、時間に応じて変化させる
    float n1 = perlinNoise(st * 0.8 + vec2(u_time * 0.5, 0.0)); // 色1
    float n2 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.2)); // 色2
    float n3 = perlinNoise(st * 0.8 + vec2(u_time * 0.5, 0.0)); // 色3
    float n4 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.5));  // 色4

    // ノイズを強調
    n1 = pow(n1, 3.0);
    n2 = pow(n2, 3.0);
    n3 = pow(n3, 3.0);
    n4 = pow(n4, 3.0);

    // 最終的な色の計算
    vec3 finalColor = (color1 * n1 + color2 * n2 + color3 * n3 + color4 * n4) * 1.3; // 明るさを調整

    // 色をクリッピングし、1.0を超えないように
    finalColor = clamp(finalColor, 0.0, 1.0);

    // 最終的な色をフラグメントに適用
    gl_FragColor = vec4(finalColor, 1.0);
}
