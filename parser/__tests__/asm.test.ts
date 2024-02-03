import { asm, buildHexInstruction, findLabels } from '../asm';
import { asmArithmetic, asmArithmetic2, asmArithmetic3, asmBranch, asmRegisterOperation, binaryToHex } from '../operations';


describe('Data processing Assembly Line to Hex Conversion', () => {
  test.each([
    ['movs r0, #0', '2000'],
    ['movs r1, #1', '2101'],
    ['movs r2, #20', '2214'],
    ['cmp r0, r1', '4288'],
    ['rsbs r2, r2, #0', '4252'],
    ['cmp r2, r1', '428A'],
    ['movs r0, #50', '2032'],
    ['adds r3, r0, r2', '1883'],

    ['movs r0, #0', '2000'], // 1-4_instructions
    ['movs r1, #170', '21AA'],
    ['movs r2, #255', '22FF'],
    ['movs r3, #15', '230F'],
    ['ands r3, r1', '400B'],
    ['movs r4, #161', '24A1'],
    ['eors r4, r1', '404C'],
    ['movs r5, #2', '2502'],
    ['movs r6, #15', '260F'],
    ['lsls r6, r5', '40AE'],
    ['movs r7, #1', '2701'],
    ['lsrs r6, r7', '40FE'],

    ['movs r0, #0', '2000'], // 5-10_instructions
    ['movs r1, #1', '2101'],
    ['movs r2, #170', '22AA'],
    ['movs r3, #255', '23FF'],
    ['movs r4, #15', '240F'],
    ['rsbs r4, r4, #0', '4264'],
    ['asrs r4, r4, #1', '1064'],
    ['movs r5, #5', '2505'],
    ['adcs r5, r1', '414D'],
    ['sbcs r5, r1', '418D'],
    ['sbcs r5, r1', '418D'],
    ['movs r6, #170', '26AA'],
    ['rors r6, r1', '41CE'],
    ['tst r2, r6', '4232'],

    ['movs r0, #0', '2000'], // 11-12_instructions
    ['movs r1, #1', '2101'],
    ['movs r2, #1', '2201'],
    ['rsbs r2, r2, #0', '4252'],
    ['movs r3, #1', '2301'],
    ['rsbs r3, r3, #0', '425B'],
    ['lsrs r3, r1', '40CB'],
    ['movs r4, #1', '2401'],
    ['cmn r3, r1', '42CB'],
    ['cmn r2, r1', '42CA'],
    ['cmp r4, r1', '428C'],
    ['cmp r0, r1', '4288'],
    ['cmp r1, r0', '4281'],


    ['movs r0, #0', '2000'], // 13-16_instructions
    ['movs r1, #1', '2101'],
    ['movs r2, #170', '22AA'],
    ['movs r3, #255', '23FF'],
    ['movs r4, #15', '240F'],
    ['orrs r4, r2', '4314'],
    ['movs r5, #45', '252D'],
    ['muls r5, r2, r5', '4355'],
    ['movs r6, #19', '2613'],
    ['bics r6, r2', '4396'],
    ['mvns r7, r2', '43D7'],

  ])('converts "%s" to hex "%s"', (input, expected) => {
    const binaryOutput = asm(input, new Map(), 0);
    const hexOutput = binaryToHex(binaryOutput);
    expect(hexOutput).toBe(expected);
  });
});



describe('Load Store Assembly Line to Hex Conversion', () => {
  test.each([
    ['movs r0, #170', '20AA'],
    ['movs r1, #255', '21FF'],
    ['add sp, #16', 'B004'],
    ['str r0, [sp, #4]', '9001'],
    ['str r1, [sp, #0]', '9100'],
    ['sub sp, #4', 'B081'],
    ['ldr r2, [sp, #4]', '9A01'],

  ])('converts "%s" to hex "%s"', (input, expected) => {
    const binaryOutput = asm(input, new Map(), 0);
    const hexOutput = binaryToHex(binaryOutput);
    expect(hexOutput).toBe(expected);
  });
});


describe('Miscellaneous Assembly Line to Hex Conversion', () => {
  test.each([
    ['add sp, #16', 'B004'],
    ['sub sp, #4', 'B081'],
  ])('converts "%s" to hex "%s"', (input, expected) => {
    const binaryOutput = asm(input, new Map(), 0);
    const hexOutput = binaryToHex(binaryOutput);
    expect(hexOutput).toBe(expected);
  });
});



describe('Shift add sub mov Assembly Line to Hex Conversion', () => {
  test.each([
    ['movs r0, #0', '2000'], // 1-4_instructions
    ['movs r1, #1', '2101'],
    ['movs r2, #170', '22AA'],
    ['movs r3, #255', '23FF'],
    ['lsls r4, r2, #1', '0054'],
    ['lsrs r5, r2, #1', '0855'],
    ['subs r6, r0, #5', '1F46'],
    ['asrs r6, r6, #1', '1076'],
    ['adds r7, r6, r1', '1877'],

    ['movs r0, #0', '2000'], // 5-8_instructions
    ['movs r1, #1', '2101'],
    ['movs r2, #170', '22AA'],
    ['movs r3, #255', '23FF'],
    ['subs r4, r3, r2', '1A9C'],
    ['adds r5, r2, #5', '1D55'],
    ['movs r6, #179', '26B3'],
  ])('converts "%s" to hex "%s"', (input, expected) => {
    const binaryOutput = asm(input, new Map(), 0);
    const hexOutput = binaryToHex(binaryOutput);
    expect(hexOutput).toBe(expected);
  });
});


describe('Branch Assembly Line to Hex Conversion', () => {
  const lines = [
    'movs r0, #0',
    'movs r1, #1',
    '.goto:',
    'movs r2, #20',
    'cmp r0, r1',
    'bMI .then1',
    'b .endif1',
    '.then1:',
    'rsbs r2, r2, #0',
    '.endif1:',
    'cmp r2, r1 ',
    'bLT .then2',
    'b .endif2',
    '.then2:',
    'movs r0, #50',
    'b .goto',
    '.endif2:',
    'adds r3, r0, r2',
    '@r3 value should be 70, 46',
  ];

  const expected = '2000 2101 2214 4288 d4ff e7ff 4252 428a dbff e000 2032 e7f4 1883';

  test('converts "%s" to hex "%s"' , () => {
    const labels = findLabels(lines)
    console.log(labels);

    const hexInstructions = buildHexInstruction(lines, labels);
    const hexOutput = hexInstructions.join(' ').toLowerCase();
    expect(hexOutput).toBe(expected);
  });
});
// 1110 0111 1111 0100

// 1101 0100 00000000
// d400 

// d4ff 

// ['bMI .then1', 'D4FF'], // Notez que les adresses exactes peuvent varier en fonction de l'implémentation
// ['b .endif1', 'E7FF'], // idem
// ['bLT .then2', 'DBFF'], // idem
// ['b .endif2', 'E000'], // idem
// ['b .goto', 'E7F4'], // idem, assurez-vous que le décalage correspond à votre logique de calcul d'adresse
