import { msg } from "../../../src/components/counter.composition";
describe("Counter", () => {
  const baseUrl = "http://localhost:8080/";
  beforeEach(() => {
    cy.server();
  });
  describe("初期化通信失敗", () => {
    it("初期化通信失敗時はエラーメッセージが表示", () => {
      cy.route({
        method: "GET",
        url: "/api/count",
        status: 500,
        response: "",
        delay: 2000
      }).as("init");
      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("span")
        .as("span");
      const events: number[] = [];
      cy.get("v-counter").then($el => $el.on("loaderr", () => events.push(0)));
      cy.get("@span").should("contain.text", msg["loading"]);
      cy.wait("@init");
      cy.get("@span").should("contain.text", msg["error:fetch"]);
      cy.wrap(events).should("eql", [0]);
    });
  });
  describe("初期化通信成功", () => {
    const count = 10000;
    beforeEach(() => {
      cy.route({
        method: "GET",
        url: "/api/count",
        response: {
          count
        }
      });
    });
    it("initialize", () => {
      cy.visit(baseUrl);

      cy.setup("v-counter")
        .find("span")
        .should("contain.text", count);
    });

    it("increment", () => {
      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("span")
        .as("span");
      cy.get("@root")
        .find("[data-test=increment]")
        .as("button");
      cy.get("@span").should("contain.text", count);
      cy.get("@button").click();
      cy.get("@span").should("contain.text", count + 1);
      cy.get("@button").click();
      cy.get("@span").should("contain.text", count + 2);
    });

    it("decrement", () => {
      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("span")
        .as("span");
      cy.get("@root")
        .find("[data-test=decrement]")
        .as("button");
      cy.get("@span").should("contain.text", count);
      cy.get("@button").click();
      cy.get("@span").should("contain.text", count - 1);
      cy.get("@button").click();
      cy.get("@span").should("contain.text", count - 2);
    });

    it("save", () => {
      const newCount = 10;
      cy.route({
        method: "POST",
        url: "/api/count",
        response: {
          count: newCount
        }
      }).as("save");

      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("span")
        .as("span");
      cy.get("@root")
        .find("[data-test=save]")
        .as("button");
      cy.get("@button").click();
      cy.wait("@save")
        .its("requestBody")
        .should("eql", { count });
      cy.get("@span").should("contain.text", newCount);
    });

    it("save fail", () => {
      cy.route({
        method: "POST",
        url: "/api/count",
        status: 500,
        response: "",
        delay: 500
      }).as("save");

      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("span")
        .as("span");
      cy.get("@root")
        .find("[data-test=save]")
        .as("button");
      // click 前は初期値
      cy.get("@span").should("contain.text", count);
      cy.get("@button").click();
      cy.wait("@save")
        .its("status")
        .should("eq", 500);
      // click 後はエラーメッセージ
      cy.get("@span").should("contain.text", msg["error:save"]);
    });
    it("change props", () => {
      const message = "hogehoge hugahuga";
      cy.visit(baseUrl);
      cy.setup("v-counter").as("root");
      cy.get("@root")
        .find("h1")
        .as("title");
      cy.get("@title").should("contain.text", "default");
      cy.get("v-counter").then($el => $el.attr("msg", message));
      cy.get("@title").should("contain.text", message);
    });
  });
});
