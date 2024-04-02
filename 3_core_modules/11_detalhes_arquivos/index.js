const fs = require("fs");

fs.stat("novoarquivo.txt", (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(stats.isFile());
  console.log(stats.isDirectory());
  console.log(stats.isSymbolicLink());
  console.log(stats.atime);
  console.log(stats.size);
});
