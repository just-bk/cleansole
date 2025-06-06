# 🧹 cleansole

A CLI tool to automatically remove all `console.*` statements (`log`, `warn`, `error`, etc.) from JavaScript and TypeScript code.

> Clean your code before production. No more forgotten `console.log`s in your deployed apps.

---

## 🚀 Features

- 🔍 Detects and removes all `console.*` calls using AST (Abstract Syntax Tree)
- 📁 Works with both single files and entire directories (recursively)
- ⚡ Fast and reliable — doesn’t touch anything except `console` statements
- 🔧 Supports `.js` and `.ts` files out of the box
- 🧼 Keeps formatting and comments intact

---

## 📦 Installation
You can install the package locally in your projects depending on your use case.

#### Installation Commands:
```bash
npm install cleansole
```
```bash
npm i cleansole
```
---

## 🧑‍💻 Usage
Syntax:
```bash
npx cleansole <path>
```
| Argument | Description                                         |
| -------- | --------------------------------------------------- |
| `<path>` | Path to a JavaScript/TypeScript file or a directory |


Examples:
- Clean a single file:
```bash
npx cleansole test.js
```
- Clean multiple files:
```bash
npx cleansole test.js test1.ts
```
- Clean all files inside a folder recursively:
```bash
npx cleansole ./folder-name
```
- Clean a deeply nested file:
```bash
npx cleansole ./main-folder/inside-folder/test.js
```
🔒 Your files will be updated in-place, removing all console calls. Always version your code or back up before batch operations.

---

## 🧠 How It Works — The Logic Explained    
Instead of using risky regular expressions to remove `console.log` statements, `cleansole` uses a safe and robust AST-based approach with Babel.

---

## 📝 Step-by-Step Breakdown:

`1.` Parsing the Source Code

Using `@babel/parser`, each file is parsed into an Abstract Syntax Tree (AST). This tree represents your code structure in a programmable format.

```bash
const ast = parser.parse(code, {
  sourceType: "module",
  plugins: ["jsx", "typescript"]
});
```

`2.` Traversing the AST

We walk through the AST using `@babel/traverse` to find:

```bash
console.log(...)
console.warn(...)
console.error(...)
```

The logic looks for:
- `ExpressionStatement`s
- Where the callee is `console` and a valid method like `log`, `warn`, etc.

```bash
if (
  t.isExpressionStatement(path.node) &&
  t.isMemberExpression(path.node.expression) &&
  path.node.expression.object.name === 'console'
) {
  path.remove();
}
```

`3.` Generating Cleaned Code

After modifying the AST (removing `console.*` calls), the cleaned code is generated using `@babel/generator`.

```bash
const output = generate(ast, {}, code);
```

`4.` Writing to File

The updated source code is written back to the same file using `fs.writeFileSync`.

---

## 📁 Project Structure

```bash
cleansole/
├── index.js         # CLI entry point
├── test.js          # Sample file
├── package.json
├── node_modules
└── lib/
    └── clean.js     # Console cleanup logic lives here
```

---

## 📌 Supported Console Methods

The tool removes all of the following:

- `console.log()`
- `console.warn()`
- `console.error()`
- `console.debug()`
- `console.info()`
- `console.trace()`

---

## 🧱 Built With

- `Node.js` (https://nodejs.org/en)
- `@babel/parser` (https://babeljs.io/)
- `@babel/traverse` (https://babeljs.io/)
- `@babel/generator` (https://babeljs.io/)
- `fs / path modules` (https://nodejs.org/en)

---

#### 🙋‍♂️ Author

Made with ❤️ by [https://github.com/just-bk] — feedback welcome!
