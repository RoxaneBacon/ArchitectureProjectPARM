import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';


type InstructionFormat = {
  opcode: number,
  fields: string[],
};

type InstructionAlias = {
  alias: string,
  substitutions: { [key: string]: string }
};

type Instruction = InstructionFormat | InstructionAlias;



// const regexes: Array<[RegExp, string]> = [
//   [new RegExp("(?:\\{(R\\w+)\\})", "gi"), "(?P<F$1>r(?P<$1>\\d))"],
//   [new RegExp("(?:\\{(imm3)\\})", "gi"), "(?P<F$1>#(?P<$1>&?\\d{1}))"],
//   [new RegExp("(?:\\{(imm\\d)\\})", "gi"), "(?P<F$1>#(?P<$1>&?\\d+))"],
//   [/({cond})/gi, "(?P<cond>(?:[a-z]{2}))"],
//   [new RegExp("\\{label(\\d+)\\}", "gi"), "(?P<label$1>[.\\w]+)"]
// ];


type RegexSubstitution = {
  pattern: RegExp,
  substitution: string
};
// const regexes: RegexSubstitution[] = [
//   { pattern: new RegExp("(?:\\{(R\\w+)\\})", "gi"), substitution: "(?P<F$1>r(?P<$1>\\d))" },
//   { pattern: new RegExp("(?:\\{(imm3)\\})", "gi"), substitution: "(?P<F$1>#(?P<$1>&?\\d{1}))" },
//   { pattern: new RegExp("(?:\\{(imm\\d)\\})", "gi"), substitution: "(?P<F$1>#(?P<$1>&?\\d+))" },
//   { pattern: /{cond}/gi, substitution: "(?P<cond>(?:[a-z]{2}))" },
//   { pattern: new RegExp("\\{label(\\d+)\\}", "gi"), substitution: "(?P<label$1>[.\\w]+)" }
// ];

const regexes: [RegExp, string][] = [
  [/\{(R\w+)\}/g, "(?P<F$1>r(?P<$1>\\d))"],
  [/\{(imm3)\}/g, "(?P<F$1>#(?P<$1>&?\\d{1}))"],
  [/\{(imm\d)\}/g, "(?P<F$1>#(?P<$1>&?\\d+))"],
  [/\{cond\}/g, "(?P<cond>(?:[a-z]{2}))"],
  [/\{label(\d+)\}/g, "(?P<label$1>[\\.\\w]+)"]
];


const conds: string[] = ["eq", "ne", "cs", "cc", "mi", "pl", "vs", "vc", "hi", "ls", "ge", "lt", "gt", "le", "al", "nv"];

const condsAlias: { [key: string]: string } = {
  "hs": "cs",
  "lo": "cc"
};


let ins: { [key: string]: Instruction | string } = {
  // 01 - move shifted register
  "lsls {Rd}, {Rm}, {imm5}": { opcode: 0b000_00, fields: ["imm5", "Rm", "Rd"] },
  "lsrs {Rd}, {Rm}, {imm5}": { opcode: 0b000_01, fields: ["imm5", "Rm", "Rd"] },
  "asrs {Rd}, {Rm}, {imm5}": { opcode: 0b000_10, fields: ["imm5", "Rm", "Rd"] },
  "movs? {Rd}, {Rm}": "lsls {Rd}, {Rm}, #0",
  // 02 - add/subtract
  "adds {Rd}, {Rn}, {Rm}": { opcode: 0b000_11_00, fields: ["Rm", "Rn", "Rd"] },
  "subs {Rd}, {Rn}, {Rm}": { opcode: 0b000_11_01, fields: ["Rm", "Rn", "Rd"] },
  // 03 - move/compare/add/subtract immediate
  "movs {Rd}, {imm8}": { opcode: 0b001_00, fields: ["Rd", "imm8"] },
  "cmp {Rd}, {imm8}": { opcode: 0b001_01, fields: ["Rd", "imm8"] },
  "adds {Rd}, ({Rd_}, )?{imm8}": { opcode: 0b001_10, fields: ["Rd", "imm8"] },
  "subs {Rd}, ({Rd_}, )?{imm8}": { opcode: 0b001_11, fields: ["Rd", "imm8"] },

  // 04 - ALU operations
  "ands {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0000, fields: ["Rm", "Rdn"] },
  "eors {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0001, fields: ["Rm", "Rdn"] },
  "lsls {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0010, fields: ["Rm", "Rdn"] },
  "lsrs {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0011, fields: ["Rm", "Rdn"] },
  "asrs {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0100, fields: ["Rm", "Rdn"] },
  "adcs {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0101, fields: ["Rm", "Rdn"] },
  "sbcs {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0110, fields: ["Rm", "Rdn"] },
  "rors {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_0111, fields: ["Rm", "Rdn"] },
  "tst {Rn}, {Rm}": { opcode: 0b010000_1000, fields: ["Rm", "Rn"] },
  "rsbs {Rd}, {Rn}, #0": { opcode: 0b010000_1001, fields: ["Rn", "Rd"] },
  "cmp {Rn}, {Rm}": { opcode: 0b010000_1010, fields: ["Rm", "Rn"] },
  "cmn {Rn}, {Rm}": { opcode: 0b010000_1011, fields: ["Rm", "Rn"] },
  "orrs {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_1100, fields: ["Rm", "Rdn"] },
  "muls {Rdm}, {Rn}, {Rdm_}": { opcode: 0b010000_1101, fields: ["Rn", "Rdm"] },
  "bics {Rdn}, ({Rdn_}, )?{Rm}": { opcode: 0b010000_1110, fields: ["Rm", "Rdn"] },
  "mvns {Rd}, {Rm}": { opcode: 0b010000_1111, fields: ["Rm", "Rd"] },
  "negs {Rd}, {Rn}": "rsbs {Rd}, {Rn}, #0",

  // 11 - SP-relative load/store
  "str {Rt}, [sp(?:, {imm8})?]": { opcode: 0b1001_0, fields: ["Rt", "imm8"] },
  "ldr {Rt}, [sp(?:, {imm8})?]": { opcode: 0b1001_1, fields: ["Rt", "imm8"] },

  // 13 - add offset to Stack Pointer
  "add (sp, )?sp, {imm7}": { opcode: 0b1011_0000_0, fields: ["imm7"] },
  "sub (sp, )?sp, {imm7}": { opcode: 0b1011_0000_1, fields: ["imm7"] },

  // 16 - conditional branch
  "b({cond}) {label8}": { opcode: 0b1101, fields: ["cond", "label8"] },

  // 18 - unconditional branch
  "b {label11}": { opcode: 0b11100, fields: ["label11"] }
};






function assemble(line: string, labels: Map<string, number>, lineNumber: number): [number, string] {
  let instr: string;
  let args: string[];

  try {
    // add type checking
    [instr, ...args] = line.split(/\s+/);
    // [instr, ...args] = line.split(/[\s,]+/).filter(Boolean) as [string, ...string[]];
    console.log(`Instruction: "${instr}", args: "${args.join(' ')}"`);
  } catch (error) {
    throw new Error(`Invalid line: "${line}"`);
  }

  let found = false;
  let oline = line;
  let m: RegExpExecArray | null;
  
  while (!found) {
    for (let arg of args) {

      const inst = new Map<RegExp, Instruction | string>();

      Object.entries(ins).forEach(([key, value]) => {
        let modifiedKey = key.replace("[", "\\[").replace("]", "\\]");
        regexes.forEach(([rg, sub]) => {
            modifiedKey = modifiedKey.replace(rg, sub);
        });
        inst.set(new RegExp(`^${modifiedKey}$`), value);
      });

      for (let [pattern, substitution] of regexes) {
        console.log(`Pattern: ${pattern}, substitution: ${substitution}, arg: ${arg}`);
        m = pattern.exec(line);
        console.log(`Pattern: ${pattern}, substitution: ${substitution}, match: ${line}`);
        if (m) {
          if (typeof ins[instr] === 'string') {
            line = line.replace(pattern, substitution);
          } else {
            found = true;
          }
          break;
        }
      }
      if (!found) {
        throw new Error(`Invalid instruction: ${oline}`);
      }
    }
  }

  // Convert line to binary or other processing here
  // This is a placeholder and needs to be adapted based on your specific needs
  let binaryRepresentation = 0; // Example placeholder value

  return [binaryRepresentation, `${lineNumber * 2} │ ${binaryRepresentation} │ ${oline} │ ...`];
}


async function main() {
  const filename = process.argv[2];
  if (!filename) {
    console.error("No input file specified.");
    return;
  }

  const fileStream = fs.createReadStream(filename);
  

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const labels = new Map<string, number>();
  const instructions: [number, string][] = [];
  let lineNumber = 0;

  for await (const line of rl) {
    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('@')) {
      continue;
    }

    // Handle labels
    const labelMatch = line.match(/^([.\w]+)\s*:/);
    if (labelMatch) {
      console.log(`Label ${labelMatch[1]} found at address ${lineNumber}`);
      labels.set(labelMatch[1], lineNumber);
      continue;
    }

    try {
      const assembled = assemble(line, labels, lineNumber);
      instructions.push(assembled);
      lineNumber++;
    } catch (error) {
      console.error(`Error on line ${lineNumber + 1}: ${error.message}`);
      return;
    }
  }

  const outputFilename = path.basename(filename, path.extname(filename)) + '.bin';
  const outputStream = fs.createWriteStream(outputFilename);
  outputStream.write("v2.0 raw\n");

  for (const [binary] of instructions) {
    outputStream.write(`${binary.toString(16)} `);
  }

  outputStream.end();
  console.log(`Assembled file written to ${outputFilename}`);
}

main().catch(err => console.error(err));
