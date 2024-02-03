import { asmRegisterOperation, asmSPStorage, asmSPoffset, asmArithmetic, asmArithmetic2, asmArithmetic3, asmDataCompute, asmBranch, asmBranch2, binaryToHex } from "./operations";


type Instruction = {
  opcode: OPcode,
  pattern: RegExp,
  assemble: AssembleMethod
}

type OPcode =
  'LSLS' | 'LSRS' | 'ASRS' | // asmRegisterOperation

  'STR' | 'LDR' |            // asmSPStorage

  'ADD' | 'SUB' |            // asmSPoffset

  'ADDS' | 'MOVS' | 'CMP' | 'SUBS' | // asmArithmetic / asmArithmetic2

  'ANDS' | 'EORS' | 'LSLS' | 'LSRS' | 'ASRS' | 'ADCS' | 'SBCS' | 'RORS' | 'TST' | 'RSBS' | 'CMP' | 'CMN' | 'ORRS' | 'MULS' | 'BICS' | 'MVNS' |    // asmDataCompute

  'BEQ' | 'BNE' | 'BCS' | 'BHS' | 'BCC' | 'BLO' | 'BMI' | 'BPL' | 'BVS' | 'BVC' | 'BHI' | 'BLS' | 'BGE' | 'BLT' | 'BGT' | 'BLE' | 'BAL' | // asmBranch

  'B' // asmBranch2
  ;


type AssembleMethod =
  'asmRegisterOperation' | 'asmSPStorage' | 'asmSPoffset' |
  'asmBranch' | 'asmBranch2' |
  'asmArithmetic' | 'asmArithmetic2' | 'asmArithmetic3' |
  'asmDataCompute';



const instructions: Instruction[] = [
  {
    opcode: 'STR',
    pattern: /^STR\s+R(\d+),\s+\[sp, #(\d+)\]$/gi,
    assemble: 'asmSPStorage'
  },
  {
    opcode: 'STR',
    pattern: /^STR\s+R(\d+),\s+\[sp\]$/gi,
    assemble: 'asmSPStorage'
  },
  {
    opcode: 'LDR',
    pattern: /^LDR\s+R(\d+),\s+\[sp, #(\d+)\]$/gi,
    assemble: 'asmSPStorage',
  },
  {
    opcode: 'LDR',
    pattern: /^LDR\s+R(\d+),\s+\[sp\]$/gi,
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

  {
    opcode: 'BEQ',
    pattern: /^BEQ\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BNE',
    pattern: /^BNE\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BCS',
    pattern: /^BCS\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BHS',
    pattern: /^BHS\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BCC',
    pattern: /^BCC\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BLO',
    pattern: /^BLO\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BMI',
    pattern: /^BMI\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BPL',
    pattern: /^BPL\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BVS',
    pattern: /^BVS\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BVC',
    pattern: /^BVC\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BHI',
    pattern: /^BHI\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BLS',
    pattern: /^BLS\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BGE',
    pattern: /^BGE\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BLT',
    pattern: /^BLT\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BGT',
    pattern: /^BGT\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BLE',
    pattern: /^BLE\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'BAL',
    pattern: /^BAL\s+\..+$/,
    assemble: 'asmBranch',
  },
  {
    opcode: 'B',
    pattern: /^B\s+\..+$/,
    assemble: 'asmBranch2',
  }
]

function extractSP(input: string): number | null {
  const regex = /\[SP, #(\d+)\]/;
  const match = input.match(regex);
  return match ? parseInt(match[1]) : null;
}


export function asm(line: string, labels: Map<string, number>, lineNumber: number) {
  line = line.toUpperCase()
  const parts = line.split(' ');
  const opcode = parts[0].toUpperCase() as OPcode;

  const instruction: Instruction | undefined = instructions.find(instruction => {
    const match = line.match(instruction.pattern);
    if (match) return instruction
    return null;
  })

  if (!instruction) throw new Error(`Invalid instruction: ${line}`);

  console.log(`\nLine ${lineNumber}: ${line}`);
  console.log(instruction.assemble + ': ' + line);

  switch (instruction.assemble) {
    case 'asmRegisterOperation':
      const asmRegisterOperationBinary = asmRegisterOperation(opcode, parts[1], parts[2], parts[3])
      console.log(asmRegisterOperationBinary);
      return asmRegisterOperationBinary.replace(/\s/g, '');

    case 'asmSPStorage':
      let spOffset = extractSP(line);
      if (spOffset === null) spOffset = 0;
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

    case 'asmBranch':
      const asmBranchBinary = asmBranch(opcode, parts[1], labels, lineNumber);
      console.log(asmBranchBinary);
      return asmBranchBinary.replace(/\s/g, '');

    case 'asmBranch2':
      const asmBranch2Binary = asmBranch2(parts[1], labels, lineNumber);
      console.log(asmBranch2Binary);
      return asmBranch2Binary.replace(/\s/g, '');
  }
}



export function findLabels(lines: string[]): Map<string, number> {
  const labels = new Map<string, number>();
  let lineNumber = 0;
  for (const line of lines) {
    if (line.endsWith(':')) {
      const label = line.slice(0, -1);
      labels.set(label.toUpperCase(), lineNumber);
    }
    if (line === '' || line.startsWith('@') || line.startsWith('#')) continue;
    lineNumber++;
  }
  return labels;
}

export function buildHexInstruction(lines: string[], labels: Map<string, number>): string[] {
  let lineNumber = 1;
  const hexInstructions: string[] = [];
  for (let line of lines) {
    line = line.trim()
    // Skip empty lines and comments
    if (line === '' || line.startsWith('@') || line.startsWith('#')) continue;
    
    if (!line.startsWith('.')) {

      const binaryLine = asm(line, labels, lineNumber);
      lineNumber++
      const hex = binaryToHex(binaryLine)
      hexInstructions.push(hex);
    }
    else {
      lineNumber++
    }

  }
  return hexInstructions;
}