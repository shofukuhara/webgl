import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const files = [
  { inputFile: "dist/assets/js/index.js", outputDir: "dist/assets/js/" }
];
const additionalComment = "/*! Please refer to licence.txt for the details of the license. */\n";

async function removeComments(filePath, outputDir) {
  try {
    // ファイルを非同期で読み込み
    const data = await readFile(filePath, "utf8");

    // 正規表現で /*! ... */ 形式のコメントを削除
    let updatedContent = data.replace(/\/\*\!.*?\*\//gs, "");

    // 空白文字（スペース、タブ、改行など）を1つのスペースに置き換え
    updatedContent = updatedContent.replace(/\s+/g, " ").trim();
    // 出力ファイルパスを作成
    const fileName = filePath.split("/").pop(); // ファイル名を取得
    const outputFilePath = join(outputDir, fileName);

    // 更新した内容をファイルに書き込み
    const finalContent = additionalComment + updatedContent;
    await writeFile(outputFilePath, finalContent, "utf8");

    console.log(`${outputFilePath}: /*! ... */ 形式のコメントを削除しました。`);
  } catch (err) {
    console.error(`${filePath}: エラー:`, err);
  }
}

async function processFiles() {
  for (const file of files) {
    await removeComments(file.inputFile, file.outputDir);
  }
}

processFiles();


