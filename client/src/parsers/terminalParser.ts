import AnsiParser from "node-ansiparser";

type PrintSequence = {
  s: string;
  instruction: "print";
};
type OscSequence = {
  s: string;
  instruction: "osc";
};
type ExecuteSequence = {
  instruction: "execute";
  flag: number;
};
type CsiSequence = {
  instruction: "csi";
  collected: string;
  params: any[];
  flag: string;
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
    instructions.push({ instruction: "print", s });
  },
  inst_o: function (s: string) {
    instructions.push({ instruction: "osc", s });
  },
  inst_x: function (flag: string) {
    instructions.push({ instruction: "execute", flag: flag.charCodeAt(0) });
  },
  inst_c: function (collected: string, params: any[], flag: string) {
    if (params.length === 1 && params[0] === 2 && flag === "J")
      // https://vt100.net/docs/vt510-rm/ED.html
      instructions.length = 0;
    instructions.push({ instruction: "csi", collected, params, flag });
  },
  inst_e: function (collected: string, flag: string) {
    instructions.push({ instruction: "esc", collected, flag });
  },
  inst_H: function (collected: string, params: string, flag: string) {
    instructions.push({ instruction: "dcs-Hook", collected, params, flag });
  },
  inst_P: function (dcs: string) {
    instructions.push({ instruction: "dcs-Put", dcs });
  },
  inst_U: function () {
    instructions.push({ instruction: "dcs-Unhook" });
  },
};

const instructions: Sequences[] = [];
const parser = new AnsiParser(terminal);

export const terminalParser = {
  parse: (data: string) => parser.parse(data),
  clear: () => (instructions.length = 0),
  print: () => console.log(JSON.stringify(instructions, null, 2)),
};
