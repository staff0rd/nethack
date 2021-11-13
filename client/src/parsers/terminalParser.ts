import AnsiParser from "node-ansiparser";
import { ansi } from "./ansi";

export type PrintSequence = {
  s: string;
  instruction: "print";
  debug?: boolean;
};
type OscSequence = {
  s: string;
  instruction: "osc";
};
type ExecuteSequence = {
  instruction: "execute";
  flag: number;
};
export type CsiSequence = {
  instruction: "csi";
  collected: string;
  params: any[];
  flag: string;
  debug?: boolean;
};
type EscSequence = {
  instruction: "esc";
  collected: string;
  flag: string;
};
type DcsHook = {
  instruction: "dcs-Hook";
  collected: string;
  params: string;
  flag: string;
};
type DcsPut = { instruction: "dcs-Put"; dcs: string };
type DcsUnhook = { instruction: "dcs-Unhook" };
export type Sequences =
  | PrintSequence
  | OscSequence
  | ExecuteSequence
  | CsiSequence
  | EscSequence
  | DcsHook
  | DcsPut
  | DcsUnhook;

export const terminal = {
  // https://vt100.net/emu/dec_ansi_parser
  // https://vt100.net/docs/vt510-rm/contents.html
  // http://www.noah.org/python/pexpect/ANSI-X3.64.htm
  // https://en.wikipedia.org/wiki/ANSI_escape_code#CSIsection
  inst_p: function (s: string) {
    add({ instruction: "print", s });
  },
  inst_o: function (s: string) {
    add({ instruction: "osc", s });
  },
  inst_x: function (flag: string) {
    add({ instruction: "execute", flag: flag.charCodeAt(0) });
  },
  inst_c: function (collected: string, params: any[], flag: string) {
    const instruction: CsiSequence = {
      instruction: "csi",
      collected,
      params,
      flag,
    };
    if (ansi.isClear(instruction)) sinceLastClear.length = 0;
    add(instruction);
  },
  inst_e: function (collected: string, flag: string) {
    add({ instruction: "esc", collected, flag });
  },
  inst_H: function (collected: string, params: string, flag: string) {
    add({ instruction: "dcs-Hook", collected, params, flag });
  },
  inst_P: function (dcs: string) {
    add({ instruction: "dcs-Put", dcs });
  },
  inst_U: function () {
    add({ instruction: "dcs-Unhook" });
  },
};

const add = (instruction: Sequences) => {
  instructions.push({ ...instruction, ix });
  sinceLastClear.push({ ...instruction, ix });
  ix++;
};

export type IndexedSequence = Sequences & { ix: number };
const instructions: IndexedSequence[] = [];
const sinceLastClear: IndexedSequence[] = [];
let buffer: string[] = [];
const parser = new AnsiParser(terminal);
let ix = 0;

export const terminalParser = {
  parse: (data: string) => {
    instructions.length = 0;
    ix = 0;
    parser.parse(data);
    buffer.push(data);
    return instructions;
  },
  clear: () => {
    sinceLastClear.length = 0;
    buffer.length = 0;
    ix = 0;
  },
  print: () =>
    console.log(
      JSON.stringify({ data: buffer, instructions: sinceLastClear }, null, 2)
    ),
};
