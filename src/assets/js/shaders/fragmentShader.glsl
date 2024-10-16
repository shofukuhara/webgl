precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_texture;  // テクスチャを受け取る

void main() {
  // UV座標を計算 (座標を[0, 1]に変換)
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // テクスチャの色を取得
    vec4 textureColor = texture2D(u_texture, uv);

  // テクスチャの色をそのまま出力
    gl_FragColor = textureColor;
}
