# InChI Problems

This repository compares the InChIs generated by a ChEMBL update with those generated by a library based on [InChI/Wasm](https://depth-first.com/articles/2021/03/25/running-inchi-anywhere-with-webassembly/).

In Out of about 114,000 records, discrepancies were found in 155 cases. This repo makes it easy to identify the differences.

To run:

```
$ npm install
$ node -r esm wasm.js
$ node -r esm chebi.js
```

Running both tasks produces output in the `out` directory:

```
$ ls out
chembl.txt wasm.txt
```

The two files can be conveniently diffed and the result display in VS Code with:

```
diff out/chembl.txt out/wasm.txt | code -
```