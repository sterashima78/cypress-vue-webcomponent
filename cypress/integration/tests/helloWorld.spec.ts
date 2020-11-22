describe("Hello World", () => {
  beforeEach(() => {
    const baseUrl = "http://localhost:8080/";
    cy.visit(baseUrl);
  });

  it("props", () => {
    cy.setup("v-hello-world", `<v-hello-world msg="HI!!"></v-hello-world>`)
      .shadow()
      .find("h1")
      .should("contain.text", "HI!!");
  });
});
