const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const chalk = require("chalk");

function cleanConsolesInDir(inputPath, selectedTypes = []) {
  const shouldMatchAll = selectedTypes.length === 0;

  const stats = fs.statSync(inputPath);
  const files = [];

  if (stats.isFile()) {
    const ext = path.extname(inputPath);
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
      files.push(inputPath);
    }
  } else if (stats.isDirectory()) {
    const pattern = `${inputPath}/**/*.{js,jsx,ts,tsx}`;
    files.push(...glob.sync(pattern));
  } else {
    console.log(chalk.red("❌ Invalid file or folder path."));
    return;
  }

  files.forEach(file => {
    const originalCode = fs.readFileSync(file, "utf8");
    const originalLines = originalCode.split("\n");
    const consoleLines = new Set();

    const ast = parser.parse(originalCode, {
      sourceType: "unambiguous",
      plugins: ["jsx", "typescript"],
    });

    let changed = false;

    traverse(ast, {
      ExpressionStatement(path) {
        const expr = path.node.expression;
        if (
          expr?.type === "CallExpression" &&
          expr.callee?.type === "MemberExpression" &&
          expr.callee.object?.name === "console"
        ) {
          const method = expr.callee.property?.name;

          if (shouldMatchAll || selectedTypes.includes(method)) {
            const line = path.node.loc?.start.line;
            if (line) {
              consoleLines.add(line);
            }
            changed = true;
            path.remove();
          }
        }
      },
    });

    if (changed) {
      let output = generator(ast, { retainLines: true }, originalCode).code;
      const outputLines = output.split("\n");

      const cleanedLines = outputLines.filter((line, index) => {
        const lineNum = index + 1;
        const wasConsole = consoleLines.has(lineNum);
        const isEmpty = line.trim() === "";
        return !(wasConsole && isEmpty);
      });

      fs.writeFileSync(file, cleanedLines.join("\n"), "utf8");
      console.log(chalk.green(`✔ Cleaned: ${file}`));
    } else {
      console.log(chalk.gray(`– No matching console found: ${file}`));
    }
  });
}

module.exports = { cleanConsolesInDir };
