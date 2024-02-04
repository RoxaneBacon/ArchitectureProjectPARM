import { buildHexInstruction, findLabels } from "../asm";

describe('One Branch Assembly Line to Hex Conversion', () => {
  const lines = [
    '.lbl:',
    'b .lbl',
  ];

  const expected = 'e7fd';

  test('One Branch Assembly Line to Hex', () => {
    const labels = findLabels(lines)
    console.log(labels);

    const hexInstructions = buildHexInstruction(lines, labels);
    const hexOutput = hexInstructions.join(' ').toLowerCase();
    expect(hexOutput).toBe(expected);
  });
});


describe('Two Branch Assembly Line to Hex Conversion', () => {
  const lines = [
    'movs r0, #0',
    'movs r1, #1',
    'b .lbl',
    'movs r2, #2',
    'movs r3, #3',
    '.lbl:',
    'movs r4, #4',
  ];

  const expected = '2000 2101 e000 2202 2303 2404';

  test('test2', () => {
    const labels = findLabels(lines)
    console.log(labels);

    const hexInstructions = buildHexInstruction(lines, labels);
    const hexOutput = hexInstructions.join(' ').toLowerCase();
    expect(hexOutput).toBe(expected);
  });
});