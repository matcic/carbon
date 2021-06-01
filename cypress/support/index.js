import "cypress-axe";
import "cypress-real-events/support";
import "cypress-storybook/cypress";

require("cypress-plugin-tab");

const DEBUG_FLAG = false;

export default DEBUG_FLAG;
Cypress.Screenshot.defaults({ screenshotOnRunFailure: DEBUG_FLAG });

// replace the moment.js because of deprecation
const dayjs = require("dayjs");

Cypress.dayjs = dayjs;

/* returning false here prevents Cypress from failing the test */
Cypress.on("uncaught:exception", () => false);

Cypress.Commands.overwrite("type", (originalFn, subject, string, options) =>
  originalFn(subject, string, Object.assign({}, options, { delay: 75 }))
);

Cypress.Commands.overwrite("log", (subject, message) =>
  cy.task("log", message)
);

function getItem(selector, counter) {
  if (
    (document.readyState === "loading" ||
      document.readyState === "interactive") &&
    document.readyState !== "completed"
  ) {
    // Loading hasn't finished yet
    document.addEventListener("DOMContentLoaded", getItem);
  } else {
    cy.wait(100, { log: DEBUG_FLAG })
      .get("#storybook-preview-iframe", { log: DEBUG_FLAG })
      .then(($iframe) => {
        const doc = $iframe.contents();
        if (!doc.find(selector).length && counter > 0) {
          return getItem(selector, counter - 1);
        }
        return cy.wrap(doc.find(selector));
      });
  }
}

Cypress.Commands.add("iFrame", (selector) => {
  getItem(selector, 50);
});
