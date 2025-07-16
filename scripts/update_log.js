const fs = require('fs');
const [,, date, sha, msg] = process.argv;
const file = 'docs/updates.json';
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
data.push({ date, version: sha, description: msg });
fs.writeFileSync(file, JSON.stringify(data, null, 2));
