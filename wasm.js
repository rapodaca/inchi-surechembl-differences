import fs from 'fs';
import zlib from 'zlib';
import runinchi from './lib/inchi-wasm.js';

fs.mkdirSync('./out', { recursive: true });

const path = './data/SureChEMBL_20210101_27.sdf.gz'
const file = zlib.gunzipSync(fs.readFileSync(path)).toString();
const records = file.split('$$$$\n');
const out = fs.createWriteStream('./out/wasm.txt', { flags: 'w' });

records.pop();

let structure = 1;

(async () => {
    const instance = await runinchi();

    for (const record of records) {
        const end = record.indexOf('M  END');
        const molfile = record.substring(0, end + 6);

        try {
            const inchi = instance.molfileToInChI(molfile);

            out.write(`Structure: ${structure++}\n${inchi}\n`);
        } catch (e) {
            out.write(`Structure: ${structure++}\nInChI=1S//\n`);
        }
    }
    
    out.end();
})();
