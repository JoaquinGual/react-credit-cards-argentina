/*eslint-disable no-var, vars-on-top, no-console */
const { promisify } = require("util");
const { exec } = require("child_process");
const fs = require("fs");

const run = promisify(exec);

const removeDirectory = () => {
  const tmpDir = ".tmp";

  // Verificar si el directorio existe antes de intentar eliminarlo
  if (fs.existsSync(tmpDir)) {
    
    // Usar rmdir en Windows, rm -rf en otras plataformas
    const removeCommand = process.platform === "win32" ? `rmdir /s /q ${tmpDir}` : `rm -rf ${tmpDir}`;
    return run(removeCommand);
  } else {
    console.log(`${tmpDir} no existe. No es necesario eliminarlo.`);
    return Promise.resolve();
  }
};

removeDirectory()
  .then(() => run("sass src/styles.scss .tmp/styles.css"))
  .then(() =>
    run("postcss .tmp/styles.css --use autoprefixer --no-map -d .tmp/")
  )
  .then(() => run("move .tmp\\styles.css .tmp\\styles-compiled.css"))
  .then(() =>
    run(
      "copy .tmp\\styles-compiled.css dist\\es\\ && copy .tmp\\styles-compiled.css dist\\lib\\"
    )
  )
  .then(() =>
    run("copy src\\styles.scss dist\\es\\ && copy src\\styles.scss dist\\lib\\")
  )
  .then(() => console.log("✔ Styles have been built"))
  .catch((err) => {
    console.error(err);
  });
