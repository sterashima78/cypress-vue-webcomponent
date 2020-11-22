describe("Counter", () => {
  beforeEach(() => {
    const baseUrl = "http://localhost:8080/";
    cy.visit(baseUrl);
  });

  it("counter is 0", () => {
    cy.setup("v-counter")
      .shadow()
      .find("span")
      .should("contain.text", "0");
  });
});
