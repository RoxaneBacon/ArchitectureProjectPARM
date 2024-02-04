import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';
import { buildHexInstruction, findLabels } from './asm';


async function main() {
  const filename = process.argv[2];
  if (!filename) return console.error("No input file specified.");

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const lines: string[] = [];
  for await (const line of rl) {
    lines.push(line);
  }

  const labels = findLabels(lines);

  const hexInstructions = buildHexInstruction(lines, labels);
  
  console.log(hexInstructions);

  const outputFilename = path.basename(filename, path.extname(filename)) + '.bin';
  const outputStream = fs.createWriteStream(outputFilename);
  outputStream.write("v2.0 raw\n");

  for (const hexInstruction of hexInstructions) {
    outputStream.write(`${hexInstruction} `);
  }

  outputStream.end();
  console.log(`Assembled file written to ${outputFilename}`);
}
main().catch(err => console.error(err));
