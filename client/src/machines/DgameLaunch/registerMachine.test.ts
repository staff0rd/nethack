import { interpret } from "xstate";
import { EventTypes, registerMachine } from "./registerMachine";

describe("registerMachine", () => {
  it("should start with init", (done) => {
    const registerService = interpret(registerMachine).onTransition((state) => {
      if (state.value === "init") done();
    });
    registerService.start();
  });
  it("should set password on login", () => {
    const registerService = interpret(registerMachine).start();
    registerService.send({
      type: EventTypes.ClickRegister,
      password: "password",
      username: "username",
      email: "some@email.com",
    });
    expect(registerService.state.context.password).toBe("password");
  });
  it("should set username on login", () => {
    const registerService = interpret(registerMachine).start();
    registerService.send({
      type: EventTypes.ClickRegister,
      password: "password",
      username: "username",
      email: "some@email.com",
    });
    expect(registerService.state.context.username).toBe("username");
  });
  it("should set email on login", () => {
    const registerService = interpret(registerMachine)
      .onDone((result) => {
        expect(result.data.email).toBe("some@email.com");
      })
      .start();
    registerService.send({
      type: EventTypes.ClickRegister,
      password: "password",
      username: "username",
      email: "some@email.com",
    });
  });
  it("should not set username on cancel", () => {
    const registerService = interpret(registerMachine).start();
    registerService.send({
      type: EventTypes.ClickCancel,
    });
    expect(registerService.state.context.username).toBe(undefined);
  });
});
