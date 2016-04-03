var fs = require('fs');
console.log(fs.readFileSync("/etc/passwd").toString());
