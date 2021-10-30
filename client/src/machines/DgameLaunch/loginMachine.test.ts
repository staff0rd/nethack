import { interpret } from "xstate";
import { EventTypes, loginMachine } from "./loginMachine";

describe("loginMachine", () => {
  it("should start with init", (done) => {
    const loginService = interpret(loginMachine).onTransition((state) => {
      if (state.value === "init") done();
    });
    loginService.start();
  });
  it("should set password on login", () => {
    const loginService = interpret(loginMachine).start();
    loginService.send({
      type: EventTypes.ClickLogin,
      password: "password",
      username: "username",
    });
    expect(loginService.state.context.password).toBe("password");
  });
  it("should set username on login", () => {
    const loginService = interpret(loginMachine).start();
    loginService.send({
      type: EventTypes.ClickLogin,
      password: "password",
      username: "username",
    });
    expect(loginService.state.context.username).toBe("username");
  });
  it("should not set username on cancel", () => {
    const loginService = interpret(loginMachine).start();
    loginService.send({
      type: EventTypes.ClickCancel,
    });
    expect(loginService.state.context.username).toBe("");
  });
});
