import fs from 'node:fs';
import path from 'node:path';
const required = ['README.md','LICENSE','NOTICE','SECURITY.md','CONTRIBUTING.md','CODE_OF_CONDUCT.md','DISCLAIMER.md','.github/pull_request_template.md'];
const missing = required.filter((f) => !fs.existsSync(f));
if (missing.length) { console.error('Missing required files:', missing.join(', ')); process.exit(1); }
const text = fs.readFileSync('README.md','utf8') + fs.readFileSync('NOTICE','utf8');
for (const term of ['cre-acquisition-orchestrator','Apache']) { if (!text.includes(term)) { console.error(`Missing attribution term ${term}`); process.exit(1); } }
const secretPattern = /(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|gho_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})/;
function walk(dir) { if (!fs.existsSync(dir)) return []; return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => { const p=path.join(dir,e.name); if (p.includes('node_modules') || p.includes('.git')) return []; return e.isDirectory()?walk(p):[p]; }); }
for (const file of walk('.')) { if (fs.statSync(file).size > 500000) continue; const body=fs.readFileSync(file,'utf8'); if(secretPattern.test(body)) { console.error(`Potential secret in ${file}`); process.exit(1); } }
console.log('lint ok');
