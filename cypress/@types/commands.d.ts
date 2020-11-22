/// <reference types="cypress" />
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/class-name-casing
  interface cy {
    setup(name: string, template?: string): Chainable<Element>;
  }
}
