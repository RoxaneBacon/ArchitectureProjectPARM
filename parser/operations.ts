


export function asmBranchUncond(label: string, labels: Map<string, number>, lineNumber: number): string {
  const labelAddress = labels.get(label);
  if (labelAddress === undefined) throw new Error(`Label ${label} not found.`);
  
  const calcul = labelAddress - lineNumber - 3;
  console.log("label line : "+labelAddress + '\n' +"line number : "+lineNumber + '\n' + "calcul : "+calcul);

  let imm11: string;
  if (calcul < 0) {
    imm11 = padLeftZeros((calcul >>> 0), 32).substring(21, 32);
  } else {
    imm11 = padLeftZeros(calcul, 11);
  }
  console.log(binaryToHex(`11100${imm11}`));
  
  return `11100 ${imm11}`;
}


export function asmBranch(opcode: string, label: string, labels: Map<string, number>, lineNumber: number): string {
  const labelAddress = labels.get(label);
  if (labelAddress === undefined) throw new Error(`Label ${label} not found.`);
  const calcul = labelAddress - lineNumber - 3;
  let imm8: string;
  console.log("label line : "+labelAddress + '\n' +"line number : "+lineNumber + '\n' + "calcul : "+calcul);

  if (calcul < 0) {
      imm8 = padLeftZeros(calcul >>> 0, 8).substring(24);
  } else {
      imm8 = padLeftZeros(calcul, 8);
  }

  const opcodeBinary = {
    'BEQ': '0000',
    'BNE': '0001',
    'BCS': '0010',
    'BHS': '0010',
    'BCC': '0011',
    'BLO': '0011',
    'BMI': '0100',
    'BPL': '0101',
    'BVS': '0110',
    'BVC': '0111',
    'BHI': '1000',
    'BLS': '1001',
    'BGE': '1010',
    'BLT': '1011',
    'BGT': '1100',
    'BLE': '1101',
    'BAL': '1110'
  }[opcode];
  
  console.log(binaryToHex(`1101${opcodeBinary}${imm8}`));

  return `1101 ${opcodeBinary} ${imm8}`;
}


export function asmDataCompute(opcode: string, rd: string, rm: string): string {
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

export function asmArithmetic3(opcode: string, rd: string, imm: string): string {
  const immEncoded = 8;
  const opcodeBinary = {
    'MOVS': '00',
    'CMP': '01',
    'ADDS': '10',
    'SUBS': '11',
  }[opcode];
  return `001 ${opcodeBinary} ${registerToBinary(rd)} ${immToBinary(imm, immEncoded)}`;
}

export function asmArithmetic2(opcode: string, rd: string, rn: string, imm: string): string {
  const immEncoded = 3;
  const opcodeBinary = {
    'ADDS': '1110',
    'SUBS': '1111'
  }[opcode];
  return `000 ${opcodeBinary} ${immToBinary(imm, immEncoded)} ${registerToBinary(rn)} ${registerToBinary(rd)}`;
}

export function asmArithmetic(opcode: string, rd: string, rn: string, rm: string): string {
  const opcodeBinary = {
    'ADDS': '1100',
    'SUBS': '1101'
  }[opcode];
  return `000 ${opcodeBinary} ${registerToBinary(rm)} ${registerToBinary(rn)} ${registerToBinary(rd)}`;
}

export function asmSPoffset(opcode: string, imm: string): string {
  const immEncoded = 7;
  const opcodeBinary = {
    'ADD': '0',
    'SUB': '1'
  }[opcode];
  return `1011 0000 ${opcodeBinary} ${immToBinary(imm, immEncoded, 4)}`;
}

export function asmRegisterOperation(opcode: string, rd: string, rm: string, imm: string): string {
  const immEncoded = 5;
  const opcodeBinary = {
    'LSLS': '00',
    'LSRS': '01',
    'ASRS': '10'
  }[opcode];
  return `000 ${opcodeBinary} ${immToBinary(imm, immEncoded)} ${registerToBinary(rm)} ${registerToBinary(rd)}`;
}

export function asmSPStorage(opcode: string, rt: string, imm: number): string {
  const immEncoded = 8;
  const opcodeBinary = {
    'STR': '0',
    'LDR': '1'
  }[opcode];
  return `1001 ${opcodeBinary} ${registerToBinary(rt)} ${immToBinary(imm / 4, immEncoded)}`;
}



export function padLeftZeros(value: number, length: number): string {
  let binaryString = value.toString(2);
  while (binaryString.length < length) {
      binaryString = "0" + binaryString;
  }
  return binaryString;
}


export function registerToBinary(register: string): string {
  const registerNumber = parseInt(register.toUpperCase().replace('R', ''));
  return registerNumber.toString(2).padStart(3, '0');
}

export function immToBinary(imm: number | string, encoded: number, divide?: number): string {
  if (typeof imm === 'string') imm = parseInt(imm.replace('#', ''));
  if (divide) imm = imm / divide;
  return imm.toString(2).padStart(encoded, '0');
}

export function binaryToHex(binaryString: string): string {
  if (binaryString.length !== 16) throw new Error('La chaîne doit être de 16 chiffres binaires.');
  let hexString = '';
  for (let i = 0; i < 16; i += 4) {
    const fourBits = binaryString.substring(i, i + 4);
    hexString += parseInt(fourBits, 2).toString(16).toUpperCase();
  }
  return hexString;
}