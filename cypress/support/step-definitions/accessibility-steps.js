const { commonButtonPreviewRoot } = require("../../locators");
const { accordionDefaultTitle } = require("../../locators/accordion");
const { actionPopoverButton } = require("../../locators/action-popover");
const { popoverSettingsIcon } = require("../../locators/popover-container");
const { simpleSelect, simpleSelectBySize } = require("../../locators/select");
const { visitComponentUrl } = require("../helper");

const A11YOptions = {
  runOnly: {
    type: "tag",
    values: [
      // "wcag2a", // WCAG 2.0 & WCAG 2.1 Level A
      // "wcag2aa", // WCAG 2.0 & WCAG 2.1 Level AA
      "wcag21a", // WCAG 2.1 Level A
      "wcag21aa", // WCAG 2.1 Level AA
      // "best-practice", // Best practices endorsed by Deque
    ],
  },
};

const terminalLog = (violations) => {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );

  cy.task("table", violationData);
};

When(
  "I generate {string} component with all stories and checkA11y",
  (component) => {
    cy.fixture("stories/stories.json").then(($json) => {
      let componentName, story;
      for (const element in $json.stories) {
        const prepareUrl = element.split("--");
        componentName = prepareUrl[0];
        story = prepareUrl[1];

        if (
          !componentName.startsWith("welcome") &&
          !componentName.startsWith("documentation") &&
          !componentName.endsWith("test") &&
          !componentName.startsWith("typography")
        ) {
          if (componentName === component) {
            cy.log(`open the ${componentName} with ${story}`);
            visitComponentUrl(componentName, story);

            // open the accordion component
            if (componentName.startsWith("accordion")) {
              accordionDefaultTitle().click({ multiple: true });
            }

            // open the action-popover component
            if (componentName.startsWith("action-popover")) {
              actionPopoverButton().eq(0).click({ force: true });
            }

            // open the pages component
            if (componentName.startsWith("pages")) {
              commonButtonPreviewRoot().click();
            }

            // open the popover-container component
            if (componentName.startsWith("popover-container")) {
              popoverSettingsIcon().click({ multiple: true });
            }

            // expand the select component
            if (componentName === "select") {
              if (componentName.startsWith("select-size")) {
                simpleSelectBySize(story).click({ multiple: true });
              }
              if (story === "required") {
                simpleSelectBySize(`${story}-select`).click();
              }
              if (story === "controlled") {
                simpleSelectBySize(story).click();
              }
            } else {
              simpleSelect().click({ multiple: true });
            }
            cy.injectAxe()
              .wait(250)
              .then(() => {
                cy.checkA11y(null, A11YOptions, terminalLog);
              });
          }
        }
      }
    });
  }
);
