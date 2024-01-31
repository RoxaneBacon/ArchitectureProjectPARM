import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

type Instruction = {
  opcode: OPcode,
  pattern: RegExp,
  assemble: AssembleMethod
}

type OPcode =
  'LSLS' | 'LSRS' | 'ASRS' | // asmRegisterOperation

  'STR' | 'LDR' |            // asmSPStorage

  'ADD' | 'SUB' |            // asmSPoffset

  'ADDS' | 'MOVS' |'CMP' |'SUBS' | // asmArithmetic / asmArithmetic2

  'ANDS' | 'EORS' | 'LSLS' | 'LSRS' | 'ASRS' | 'ADCS' | 'SBCS' | 'RORS' | 'TST' | 'RSBS' | 'CMP' | 'CMN' | 'ORRS' | 'MULS' | 'BICS' | 'MVNS' |    // asmDataCompute

  'BEQ' | 'BNE' | 'BCS' | 'BHS' | 'BCC' | 'BLO' | 'BMI' | 'BPL' | 'BVS' | 'BVC' | 'BHI' | 'BLS' | 'BGE' | 'BLT' | 'BGT' | 'BLE' | 'BAL' // asmBranch
;


type AssembleMethod =
'asmRegisterOperation' | 'asmSPStorage' | 'asmSPoffset' | 'asmBranch' |
'asmArithmetic' | 'asmArithmetic2' | 'asmArithmetic3' |
'asmDataCompute' ;


const instructions: Instruction[] = [
  {
    opcode: 'STR',
    pattern: /^STR\s+R(\d+),\s+\[sp, #(\d+)\]$/gi,
    assemble: 'asmSPStorage'
  },
  {
    opcode: 'LDR',
    pattern: /^LDR\s+R(\d+),\s+\[sp, #(\d+)\]$/gi,
    assemble: 'asmSPStorage',
  },

  {
    opcode: 'LSLS',
    pattern: /^LSLS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmRegisterOperation'
  },
  {
    opcode: 'LSRS',
    pattern: /^LSRS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmRegisterOperation'
  },
  {
    opcode: 'ASRS',
    pattern: /^ASRS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmRegisterOperation'
  },

  {
    opcode: 'ADD',
    pattern: /^ADD\s+SP,\s+#(\d+)$/,
    assemble: 'asmSPoffset'
  },
  {
    opcode: 'SUB',
    pattern: /^SUB\s+SP,\s+#(\d+)$/,
    assemble: 'asmSPoffset'
  },

  {
    opcode: 'ADDS',
    pattern: /^ADDS\s+R(\d+),\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmArithmetic'
  },
  {
    opcode: 'SUBS',
    pattern: /^SUBS\s+R(\d+),\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmArithmetic'
  },

  {
    opcode: 'ADDS',
    pattern: /^ADDS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic2',
  },
  {
    opcode: 'SUBS',
    pattern: /^SUBS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic2'
  },

  {
    opcode: 'ADDS',
    pattern: /^ADDS\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic3',
  },
  {
    opcode: 'SUBS',
    pattern: /^SUBS\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic3'
  },
  {
    opcode: 'MOVS',
    pattern: /^MOVS\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic3',
  },
  {
    opcode: 'CMP',
    pattern: /^CMP\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmArithmetic3'
  },

  {
    opcode: 'ANDS',
    pattern: /^ANDS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'EORS',
    pattern: /^EORS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'LSLS',
    pattern: /^LSLS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'LSRS',
    pattern: /^LSRS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'ASRS',
    pattern: /^ASRS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'ADCS',
    pattern: /^ADCS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'SBCS',
    pattern: /^SBCS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'RORS',
    pattern: /^RORS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'TST',
    pattern: /^TST\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'RSBS',
    pattern: /^RSBS\s+R(\d+),\s+R(\d+),\s+#(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'CMP',
    pattern: /^CMP\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'CMN',
    pattern: /^CMN\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'ORRS',
    pattern: /^ORRS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'MULS',
    pattern: /^MULS\s+R(\d+),\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'BICS',
    pattern: /^BICS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
  {
    opcode: 'MVNS',
    pattern: /^MVNS\s+R(\d+),\s+R(\d+)$/,
    assemble: 'asmDataCompute',
  },
]

function extractSP(input: string): number | null {
  const regex = /\[SP, #(\d+)\]/;
  const match = input.match(regex);
  return match ? parseInt(match[1]) : null;
}


function asm(line:string) {
  line = line.toUpperCase()
  const parts = line.split(' ');
  const opcode = parts[0].toUpperCase() as OPcode;

  const instruction: Instruction | undefined = instructions.find(instruction => {
    const match = line.match(instruction.pattern);
    if (match) return instruction
    return null;
  })
  
  if (!instruction) return ''
  console.log(`Invalid instruction: ${line}`)

  console.log('\n'+instruction.assemble + ': '+ line);

  switch (instruction.assemble) {
    case 'asmRegisterOperation':
      const asmRegisterOperationBinary = asmRegisterOperation(opcode, parts[1], parts[2], parts[3])
      console.log(asmRegisterOperationBinary);
      return asmRegisterOperationBinary.replace(/\s/g, '');

    case 'asmSPStorage':
      const spOffset = extractSP(line);
      if (spOffset === null) throw new Error(`Invalid STR instruction: ${line}`);
      const asmSPStorageBinary = asmSPStorage(opcode, parts[1], spOffset)
      console.log(asmSPStorageBinary);
      return asmSPStorageBinary.replace(/\s/g, '');

    case 'asmSPoffset':
      const asmSPoffsetBinary = asmSPoffset(opcode, parts[2]);
      console.log(asmSPoffsetBinary);
      return asmSPoffsetBinary.replace(/\s/g, '');

    case 'asmArithmetic':
      const asmArithmeticBinary = asmArithmetic(opcode, parts[1], parts[2], parts[3]);
      console.log(asmArithmeticBinary);
      return asmArithmeticBinary.replace(/\s/g, '');

    case 'asmArithmetic2':
      const asmArithmetic2Binary = asmArithmetic2(opcode, parts[1], parts[2], parts[3]);
      console.log(asmArithmetic2Binary);
      return asmArithmetic2Binary.replace(/\s/g, '');

    case 'asmArithmetic3':
      const asmArithmetic3Binary = asmArithmetic3(opcode, parts[1], parts[2]);
      console.log(asmArithmetic3Binary);
      return asmArithmetic3Binary.replace(/\s/g, '');

    case 'asmDataCompute':
      const asmDataComputeBinary = asmDataCompute(opcode, parts[1], parts[2]);
      console.log(asmDataComputeBinary);
      return asmDataComputeBinary.replace(/\s/g, '');
  }
  return '';
}


function asmDataCompute(opcode: string, rd: string, rm: string): string {
  const opcodeBinary = {
    'ANDS': '0000',
    'EORS': '0001',
    'LSLS': '0010',
    'LSRS': '0011',
    'ASRS': '0100',
    'ADCS': '0101',
    'SBCS': '0110',
    'RORS': '0111',
    'TST': '1000',
    'RSBS': '1001',
    'CMP': '1010',
    'CMN': '1011',
    'ORRS': '1100',
    'MULS': '1101',
    'BICS': '1110',
    'MVNS': '1111'
  }[opcode];
  return `010000 ${opcodeBinary} ${registerToBinary(rm)} ${registerToBinary(rd)}`;
}

function asmArithmetic3(opcode: string, rd: string, imm: string): string {
  const immEncoded = 8;
  const opcodeBinary = {
    'MOVS': '00',
    'CMP': '01',
    'ADDS': '10',
    'SUBS': '11',
  }[opcode];
  return `001 ${opcodeBinary} ${registerToBinary(rd)} ${immToBinary(imm, immEncoded)}`;
}

function asmArithmetic2(opcode: string, rd: string, rn: string, imm: string): string {
  const immEncoded = 3;
  const opcodeBinary = {
    'ADDS': '1110',
    'SUBS': '1111'
  }[opcode];
  return `000 ${opcodeBinary} ${immToBinary(imm, immEncoded)} ${registerToBinary(rn)} ${registerToBinary(rd)}`;
}

function asmArithmetic(opcode: string, rd: string, rn: string, rm: string): string {
  const opcodeBinary = {
    'ADDS': '1100',
    'SUBS': '1101'
  }[opcode];
  return `000 ${opcodeBinary} ${registerToBinary(rm)} ${registerToBinary(rn)} ${registerToBinary(rd)}`;
}

function asmSPoffset(opcode: string, imm: string): string {
  const immEncoded = 7;
  const opcodeBinary = {
    'ADD': '0',
    'SUB': '1'
  }[opcode];
  return `1011 0000 ${opcodeBinary} ${immToBinary(imm, immEncoded)}`;
}

function asmRegisterOperation(opcode: string, rd: string, rm: string, imm: string): string {
  const immEncoded = 5;
  const opcodeBinary = {
    'LSLS': '00',
    'LSRS': '01',
    'ASRS': '10'
  }[opcode];
  return `000 ${opcodeBinary} ${immToBinary(imm, immEncoded)} ${registerToBinary(rm)} ${registerToBinary(rd)}`;
}

function asmSPStorage(opcode: string, rt: string, imm: number): string {
  const immEncoded = 8;
  const opcodeBinary = {
    'STR': '0',
    'LDR': '1'
  }[opcode];
  return `1001 ${opcodeBinary} ${registerToBinary(rt)} ${immToBinary(imm, immEncoded)}`;
}





function registerToBinary(register: string): string {
  const registerNumber = parseInt(register.toUpperCase().replace('R', ''));
  return registerNumber.toString(2).padStart(3, '0');
}

function immToBinary(imm: number | string, encoded: number): string {
  if (typeof imm === 'string') imm = parseInt(imm.replace('#', ''));
  return imm.toString(2).padStart(encoded, '0');
}



function binaryToHex(binaryString: string): string {
  if (binaryString.length !== 16) throw new Error('La chaîne doit être de 16 chiffres binaires.');
  let hexString = '';
  for (let i = 0; i < 16; i += 4) {
    const fourBits = binaryString.substring(i, i + 4);
    hexString += parseInt(fourBits, 2).toString(16).toUpperCase();
  }
  return hexString;
}


async function main() {
  const filename = process.argv[2];
  if (!filename) return console.error("No input file specified.");

  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  const hexInstructions: string[] = [];
  for await (const line of rl) {
    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('@') || line.trim().startsWith('#')) continue;
    const binaryLine = asm(line);
    const hex = binaryToHex(binaryLine)
    hexInstructions.push(hex);
  }
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