describe("Counter", () => {
  const baseUrl = "http://localhost:8080/";
  beforeEach(() => {
    cy.server();
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
  });
});
