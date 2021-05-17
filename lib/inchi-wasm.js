import fs from 'fs';
import WASI from '@wasmer/wasi';

const libinchi = async () => {
  const wasmPath = './bin/inchi_wasm.wasm';
  const memory = new WebAssembly.Memory({ initial: 10 });
  const bytes = new Uint8Array(fs.readFileSync(wasmPath)).buffer;
  const wasi = new WASI({ });
  
  const { instance } = await WebAssembly.instantiate(bytes, {
    env: { memory },
    wasi_snapshot_preview1: wasi.wasiImport
  });

  const pMolfile = instance.exports.malloc(0x8000);
  const pOptions = instance.exports.malloc(0x1000);
  const pOutput = instance.exports.malloc(0x8000);
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const molfileToInChI = (molfile, options = '') => {
    const inputView = new Uint8Array(memory.buffer);
  
    inputView.set(encoder.encode(molfile + '\0'), pMolfile);
    inputView.set(encoder.encode(options + "\0"), pOptions);

    const status = instance.exports.molfile_to_inchi(
      pMolfile, pOptions, pOutput
    );
  
    const outputView = new Uint8Array(memory.buffer);
    const output = decoder.decode(
      outputView.subarray(pOutput, outputView.indexOf(0, pOutput))
    );

    if (status < 0) {
      throw Error(output);
    }

    return output;
  };

  return { molfileToInChI };
};

export default libinchi