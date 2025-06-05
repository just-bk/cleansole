const fs = require("fs");
const path = require("path");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const chalk = require("chalk");

function cleanConsolesInDir(inputPath) {
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
    const code = fs.readFileSync(file, "utf8");

    const ast = parser.parse(code, {
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
          changed = true;
          path.remove();
        }
      },
    });

    if (changed) {
      const output = generator(ast, { retainLines: true }, code).code;
      fs.writeFileSync(file, output, "utf8");
      console.log(chalk.green(`✔ Cleaned: ${file}`));
    } else {
      console.log(chalk.gray(`– No console found: ${file}`));
    }
  });
}

module.exports = { cleanConsolesInDir };
