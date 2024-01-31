"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var readline = require("readline");
var path = require("path");
var instructions = [
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
];
function extractSP(input) {
    var regex = /\[SP, #(\d+)\]/;
    var match = input.match(regex);
    return match ? parseInt(match[1]) : null;
}
function asm(line, labels, lineNumber) {
    line = line.toUpperCase();
    var parts = line.split(' ');
    var opcode = parts[0].toUpperCase();
    var instruction = instructions.find(function (instruction) {
        var match = line.match(instruction.pattern);
        if (match)
            return instruction;
        return null;
    });
    if (!instruction)
        throw new Error("Invalid instruction: ".concat(line));
    console.log("\nLine ".concat(lineNumber, ": ").concat(line));
    console.log(instruction.assemble + ': ' + line);
    switch (instruction.assemble) {
        case 'asmRegisterOperation':
            var asmRegisterOperationBinary = asmRegisterOperation(opcode, parts[1], parts[2], parts[3]);
            console.log(asmRegisterOperationBinary);
            return asmRegisterOperationBinary.replace(/\s/g, '');
        case 'asmSPStorage':
            var spOffset = extractSP(line);
            if (spOffset === null)
                spOffset = 0;
            var asmSPStorageBinary = asmSPStorage(opcode, parts[1], spOffset);
            console.log(asmSPStorageBinary);
            return asmSPStorageBinary.replace(/\s/g, '');
        case 'asmSPoffset':
            var asmSPoffsetBinary = asmSPoffset(opcode, parts[2]);
            console.log(asmSPoffsetBinary);
            return asmSPoffsetBinary.replace(/\s/g, '');
        case 'asmArithmetic':
            var asmArithmeticBinary = asmArithmetic(opcode, parts[1], parts[2], parts[3]);
            console.log(asmArithmeticBinary);
            return asmArithmeticBinary.replace(/\s/g, '');
        case 'asmArithmetic2':
            var asmArithmetic2Binary = asmArithmetic2(opcode, parts[1], parts[2], parts[3]);
            console.log(asmArithmetic2Binary);
            return asmArithmetic2Binary.replace(/\s/g, '');
        case 'asmArithmetic3':
            var asmArithmetic3Binary = asmArithmetic3(opcode, parts[1], parts[2]);
            console.log(asmArithmetic3Binary);
            return asmArithmetic3Binary.replace(/\s/g, '');
        case 'asmDataCompute':
            var asmDataComputeBinary = asmDataCompute(opcode, parts[1], parts[2]);
            console.log(asmDataComputeBinary);
            return asmDataComputeBinary.replace(/\s/g, '');
        case 'asmBranch':
            var asmBranchBinary = asmBranch(opcode, parts[1], labels, lineNumber);
            console.log(asmBranchBinary);
            return asmBranchBinary.replace(/\s/g, '');
        case 'asmBranch2':
            var asmBranch2Binary = asmBranch2(parts[1], labels, lineNumber);
            console.log(asmBranch2Binary);
            return asmBranch2Binary.replace(/\s/g, '');
    }
}
function padLeftZeros(inputString, length) {
    if (inputString.length >= length) {
        return inputString;
    }
    var result = inputString;
    while (result.length < length) {
        result = '0' + result;
    }
    return result;
}
function asmBranch2(label, labels, lineNumber) {
    var labelAddress = labels.get(label);
    if (labelAddress === undefined)
        throw new Error("Label ".concat(label, " not found."));
    var calcul = labelAddress - lineNumber - 3;
    var imm11;
    if (calcul < 0) {
        imm11 = padLeftZeros((calcul >>> 0).toString(2).substring(21), 11);
    }
    else {
        imm11 = padLeftZeros(calcul.toString(2), 8);
    }
    return "11100 ".concat(imm11);
}
function asmBranch(opcode, label, labels, lineNumber) {
    var labelAddress = labels.get(label);
    if (labelAddress === undefined)
        throw new Error("Label ".concat(label, " not found."));
    var calcul = labelAddress - lineNumber - 3;
    var imm8;
    if (calcul < 0) {
        imm8 = padLeftZeros((calcul >>> 0).toString(2).substring(24), 8);
    }
    else {
        imm8 = padLeftZeros(calcul.toString(2), 8);
    }
    var opcodeBinary = {
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
    return "1101 ".concat(opcodeBinary, " ").concat(imm8);
}
function asmDataCompute(opcode, rd, rm) {
    var opcodeBinary = {
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
    return "010000 ".concat(opcodeBinary, " ").concat(registerToBinary(rm), " ").concat(registerToBinary(rd));
}
function asmArithmetic3(opcode, rd, imm) {
    var immEncoded = 8;
    var opcodeBinary = {
        'MOVS': '00',
        'CMP': '01',
        'ADDS': '10',
        'SUBS': '11',
    }[opcode];
    return "001 ".concat(opcodeBinary, " ").concat(registerToBinary(rd), " ").concat(immToBinary(imm, immEncoded));
}
function asmArithmetic2(opcode, rd, rn, imm) {
    var immEncoded = 3;
    var opcodeBinary = {
        'ADDS': '1110',
        'SUBS': '1111'
    }[opcode];
    return "000 ".concat(opcodeBinary, " ").concat(immToBinary(imm, immEncoded), " ").concat(registerToBinary(rn), " ").concat(registerToBinary(rd));
}
function asmArithmetic(opcode, rd, rn, rm) {
    var opcodeBinary = {
        'ADDS': '1100',
        'SUBS': '1101'
    }[opcode];
    return "000 ".concat(opcodeBinary, " ").concat(registerToBinary(rm), " ").concat(registerToBinary(rn), " ").concat(registerToBinary(rd));
}
function asmSPoffset(opcode, imm) {
    var immEncoded = 7;
    var opcodeBinary = {
        'ADD': '0',
        'SUB': '1'
    }[opcode];
    return "1011 0000 ".concat(opcodeBinary, " ").concat(immToBinary(imm, immEncoded));
}
function asmRegisterOperation(opcode, rd, rm, imm) {
    var immEncoded = 5;
    var opcodeBinary = {
        'LSLS': '00',
        'LSRS': '01',
        'ASRS': '10'
    }[opcode];
    return "000 ".concat(opcodeBinary, " ").concat(immToBinary(imm, immEncoded), " ").concat(registerToBinary(rm), " ").concat(registerToBinary(rd));
}
function asmSPStorage(opcode, rt, imm) {
    var immEncoded = 8;
    var opcodeBinary = {
        'STR': '0',
        'LDR': '1'
    }[opcode];
    return "1001 ".concat(opcodeBinary, " ").concat(registerToBinary(rt), " ").concat(immToBinary(imm, immEncoded));
}
function registerToBinary(register) {
    var registerNumber = parseInt(register.toUpperCase().replace('R', ''));
    return registerNumber.toString(2).padStart(3, '0');
}
function immToBinary(imm, encoded) {
    if (typeof imm === 'string')
        imm = parseInt(imm.replace('#', ''));
    return imm.toString(2).padStart(encoded, '0');
}
function binaryToHex(binaryString) {
    if (binaryString.length !== 16)
        throw new Error('La chaîne doit être de 16 chiffres binaires.');
    var hexString = '';
    for (var i = 0; i < 16; i += 4) {
        var fourBits = binaryString.substring(i, i + 4);
        hexString += parseInt(fourBits, 2).toString(16).toUpperCase();
    }
    return hexString;
}
function main() {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var filename, fileStream, rl, labels, lineNumber, lines, _d, rl_1, rl_1_1, line, e_1_1, _i, lines_1, line, labelMatch, hexInstructions, _e, lines_2, line, binaryLine, hex, outputFilename, outputStream, _f, hexInstructions_1, hexInstruction;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    filename = process.argv[2];
                    if (!filename)
                        return [2 /*return*/, console.error("No input file specified.")];
                    fileStream = fs.createReadStream(filename);
                    rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
                    labels = new Map();
                    lineNumber = 0;
                    lines = [];
                    _g.label = 1;
                case 1:
                    _g.trys.push([1, 6, 7, 12]);
                    _d = true, rl_1 = __asyncValues(rl);
                    _g.label = 2;
                case 2: return [4 /*yield*/, rl_1.next()];
                case 3:
                    if (!(rl_1_1 = _g.sent(), _a = rl_1_1.done, !_a)) return [3 /*break*/, 5];
                    _c = rl_1_1.value;
                    _d = false;
                    line = _c;
                    lines.push(line);
                    _g.label = 4;
                case 4:
                    _d = true;
                    return [3 /*break*/, 2];
                case 5: return [3 /*break*/, 12];
                case 6:
                    e_1_1 = _g.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 12];
                case 7:
                    _g.trys.push([7, , 10, 11]);
                    if (!(!_d && !_a && (_b = rl_1.return))) return [3 /*break*/, 9];
                    return [4 /*yield*/, _b.call(rl_1)];
                case 8:
                    _g.sent();
                    _g.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 11: return [7 /*endfinally*/];
                case 12:
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        lineNumber++;
                        labelMatch = line.match(/^([.\w]+)\s*:/);
                        if (labelMatch) {
                            console.log("Label ".concat(labelMatch[1], " found at address ").concat(lineNumber));
                            labels.set(labelMatch[1], lineNumber);
                            continue;
                        }
                    }
                    lineNumber = 0;
                    hexInstructions = [];
                    for (_e = 0, lines_2 = lines; _e < lines_2.length; _e++) {
                        line = lines_2[_e];
                        line = line.trim();
                        // Skip empty lines and comments
                        if (line === '' || line.startsWith('@') || line.startsWith('#') || line.startsWith('.'))
                            continue;
                        binaryLine = asm(line, labels, lineNumber);
                        hex = binaryToHex(binaryLine);
                        hexInstructions.push(hex);
                        lineNumber++;
                    }
                    console.log(hexInstructions);
                    outputFilename = path.basename(filename, path.extname(filename)) + '.bin';
                    outputStream = fs.createWriteStream(outputFilename);
                    outputStream.write("v2.0 raw\n");
                    for (_f = 0, hexInstructions_1 = hexInstructions; _f < hexInstructions_1.length; _f++) {
                        hexInstruction = hexInstructions_1[_f];
                        outputStream.write("".concat(hexInstruction, " "));
                    }
                    outputStream.end();
                    console.log("Assembled file written to ".concat(outputFilename));
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) { return console.error(err); });
