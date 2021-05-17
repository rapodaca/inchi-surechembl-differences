import fs from 'fs';
import zlib from 'zlib';

fs.mkdirSync('./out', { recursive: true });

const path = './data/SureChEMBL_20210101_27.sdf.gz';
const file = zlib.gunzipSync(fs.readFileSync(path)).toString();
const records = file.split('$$$$\n');
const out = fs.createWriteStream('./out/chembl.txt', { flags: 'w' });

records.pop();

let structure = 1;

for (const record of records) {
    const inchiRegex = /> <InChI>\n(.*)\n/g;
    const inchi = inchiRegex.exec(record)[1];

    out.write(`Structure: ${structure++}\n${inchi}\n`);
}

out.end();