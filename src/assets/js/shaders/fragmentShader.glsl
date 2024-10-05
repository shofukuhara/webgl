precision mediump float;

uniform vec2 u_resolution;  // 画面解像度
uniform float u_time;       // 経過時間

void main() {
  // フラグメントの座標を正規化 (0.0〜1.0の範囲に変換)
  vec2 st = gl_FragCoord.xy / u_resolution;

  // 基本的な縦方向のグラデーション（st.yで上下に）
  float gradient = st.y;

  // 時間に基づいて色が上下にゆっくり変化するシンプルなサイン波
  float timeEffect = sin(u_time + st.y * 2.0) * 0.2; // 0.2は変化の強さ

  // グラデーションのベースとなる2つの色
  vec3 topColor = vec3(0.5, 0.7, 1.0);   // 明るい青色 (上部の色)
  vec3 bottomColor = vec3(0.0, 0.3, 0.8); // 深い青色 (下部の色)

  // 時間に基づいた効果を追加しつつ、グラデーションを補間
  vec3 color = mix(bottomColor, topColor, gradient + timeEffect);

  // 最終的な色をフラグメントに適用
  gl_FragColor = vec4(color, 1.0);
}
