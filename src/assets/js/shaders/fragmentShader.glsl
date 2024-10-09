precision mediump float;

uniform vec2 u_resolution;  // 画面解像度
uniform float u_time;       // 経過時間

// ノイズ生成関数
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(15.0, 78.0))) * 6000.0);
}

// 2Dノイズを生成
float perlinNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // ノイズの計算を行う
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));

    // スムーズな補間
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    // 座標が画面内にあるか確認
    if (st.x < 0.0 || st.x > 1.0 || st.y < 0.0 || st.y > 1.0) {
        // 画面外の場合は黒に設定
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return; // ここで処理を終了
    }

    float scale = 2.5;  // スケール値
    st *= scale;

    // ノイズを生成
    float f = perlinNoise(st * 0.8 + vec2(u_time * 0.5, 0.0));

    // 青系の色の生成と色の補間
    vec3 baseColor = vec3(0.0588, 0.0, 0.5725);
    vec3 subColor = vec3(0.0, 0.0, 0.0);

    // 色の補間
    vec3 color = mix(baseColor, subColor, clamp((f * f) * 2.0, 0.0, 1.0));

    // 縦方向の動きを強調するために、y成分に大きな影響を与える
    float n1 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.5)); // 色1
    float n2 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.7)); // 色2
    float n3 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.5)); // 色3
    float n4 = perlinNoise(st * 0.8 + vec2(0.0, u_time * 0.6)); // 色4

    // ノイズを強調
    n1 = pow(n1, 3.0);
    n2 = pow(n2, 3.0);
    n3 = pow(n3, 3.0);
    n4 = pow(n4, 3.0);

    // 最終的な色の計算
    vec3 finalColor = (color * n1 + color * n2 + color * n3 + color * n4) * 1.3; // 明るさを調整

    // 色をクリッピングし、1.0を超えないように
    finalColor = clamp(finalColor, 0.0, 1.0);

    // 最終的な色をフラグメントに適用
    gl_FragColor = vec4(finalColor, 1.0);
}

