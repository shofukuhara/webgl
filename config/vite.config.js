import { defineConfig } from 'vite';
import path from 'path';
import globule from 'globule';
import vitePluginPugStatic from '@macropygia/vite-plugin-pug-static';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import license from "rollup-plugin-license";
import glsl from 'vite-plugin-glsl';
import { terser } from 'rollup-plugin-terser';
import fs from 'fs';

// `src` ディレクトリ内の Pug ファイルを取得
const inputs = {};
const documents = globule.find([path.resolve(__dirname, '../src/**/*.pug')], {
  ignore: [path.resolve(__dirname, '../src/**/_*.pug')],
});

// Pugファイルを出力
documents.forEach((document) => {
  const fileName = path.relative(path.resolve(__dirname, '../src'), document);
  const outputName = fileName.replace(/\.pug$/, '.html');
  inputs[outputName] = document;
});

// CSS と JS だけをビルドするための出力設定
const outputOptions = {
  entryFileNames: 'assets/js/index.js',
  chunkFileNames: 'assets/js/index.js',
  assetFileNames: (assetInfo) => {
    if (/\.(gif|jpeg|jpg|png|svg|webp)$/.test(assetInfo.name)) {
      return 'assets/images/[name].[ext]';
    }
    if (/\.css$/.test(assetInfo.name)) {
      return 'assets/css/[name].[ext]';
    }
    return 'assets/[name].[ext]';
  },
};

export default defineConfig({
  root: path.resolve(__dirname, '../src'), // `src` ディレクトリから見た相対パス
  base: './',
  build: {
    outDir: path.resolve(__dirname, '../dist'), // ビルド出力先
    emptyOutDir: true,
    minify: 'terser', // terserを使ってminify
    terserOptions: {
      format: {
        comments: false, // 全てのコメントを削除
      },
      compress: {
        drop_console: true, // console.logを削除
      },
    },
    rollupOptions: {
      input: inputs, // Pug からのエントリーポイントを指定
      output: outputOptions,
      plugins: [
        {
          name: 'add-license-comment',
          writeBundle: () => {
            const filePath = path.resolve(__dirname, '../dist/assets/js/index.js');
            const comment = '/*! Please refer to licence.txt for the details of the license. */\n';
            // ファイルの内容を読み込む
            fs.readFile(filePath, 'utf8', (err, data) => {
              if (err) {
                console.error(err);
                return;
              }
              // 先頭にコメントを追加する
              const modifiedData = comment + data;
              fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                if (err) {
                  console.error(err);
                }
              });
            });
          },
        },
        terser(),
      ],
    },
  },
  plugins: [
    vitePluginPugStatic({
      buildOptions: { basedir: path.resolve(__dirname, '../src') },
      serveOptions: { basedir: path.resolve(__dirname, '../src') },
    }),
    // 使用しているライブラリのライセンス出力
    license({
      thirdParty: {
        output: path.join(__dirname, "../dist/assets/js/license.txt"),
        includePrivate: true, // Default is false.
      },
    }),
    glsl({
      include: /\.(vs|fs|frag|vert|glsl)$/,
      compress: true,
    }),
    // ビルドしたディレクトリをコピー
    // viteStaticCopy({
    //   targets: [
    //     {
    //       src: path.join(__dirname, '../dist/assets/css'),
    //       dest: path.resolve(__dirname, '')
    //     },
    //     {
    //       src: path.resolve(__dirname, '../dist/assets/js'),
    //       dest: path.resolve(__dirname, '')
    //     }
    //   ],
    // }),
  ],
  server: {
    open: true,
    host: true,
    port: 3000,
  },
});
