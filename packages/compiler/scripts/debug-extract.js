import fs from 'fs';
const path = 'tests/fixtures/input/complex-contract.movejs';
const s = fs.readFileSync(path,'utf8');
console.log('--- file start ---');
console.log(s);
console.log('--- regex ---');
const m = s.match(/contract\s+([A-Za-z0-9_]+)/);
console.log('match:', m ? m[1] : null);
