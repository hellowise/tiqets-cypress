import bookingSelectors from '../support/selectors/bookingSelectors.js';
import homeSelectors from '../support/selectors/homeSelectors.js';
let language = Cypress.env('language');
let currency = Cypress.env('currency');

// This feature tests some of the tests described on the STD PDF I sent
// I tried to do my best with lacking ids/unique classes on the page elements
// Any feedback is appreciated,
// Heloise Fonseca (heloisefonseca@hotmail.com)

describe('Handpicked combinations for New York attractions', () => {
  beforeEach(() => {
    // Loads the webpage
    cy.visit('/new-york-attractions-c260932/?show=attractions')
    // Opens the website settings
    cy.get(homeSelectors.languageAndCurrencySettings).click()
    // Selects the language from env
    cy.get(homeSelectors.languageCurrencyOptions).first().select(language)
    // Selects the currency from env
    cy.get(homeSelectors.languageCurrencyOptions).last().select(currency)
    // Saves changes
    cy.get(homeSelectors.saveChanges).click()
  })

  it('Visits for children at the Statue of Liberty require an adult to accompany them', () => {
    // Selects statue of liberty + Empire state handpicked combo
    cy.get(homeSelectors.combinationStatueAndEmpireState).click()
    cy.get(bookingSelectors.handPickedOptionBookNow).click()
    // Selects first available valid date
    cy.get(bookingSelectors.selectDateFirstAttraction).click()
    cy.get(bookingSelectors.validDates).first().click()
    // Select last available time slot
    cy.get(bookingSelectors.selectTimeslotFirstAttraction).find('option:enabled').last().then(function($elem) {
      cy.get(bookingSelectors.selectTimeslotFirstAttraction).select($elem.text())
    })
    // Validates cannot add tickets for children with no other ticket type selected
    cy.get(bookingSelectors.selectTicketsFirstAttraction).click()
    cy.get(bookingSelectors.ticketAddRemoveForChild).last().should('be.disabled')
    // Validates notice message according to the selected language
    cy.fixture('childTicketNoticeText').then(function (childTicketText) {
      cy.get(bookingSelectors.ticketAddRemoveForChildNoticeText).should('have.text', childTicketText[language])
    })
    // Selects one adult ticket
    cy.get(bookingSelectors.ticketAddRemoveForAdult).last().click()
    // Validates adding tickets to children is now enabled
    cy.get(bookingSelectors.ticketAddRemoveForChild).last().should('be.enabled')
  })

  it('All hand picked combinations available sum up to 9 options', () => {
    // Extra check
    cy.get(homeSelectors.handPickedSection).should('exist')
    // Validates handpicked combinations sum up to 9 options
    cy.get(homeSelectors.handPickedBundleOptions).should('have.length', 9)
  })

  afterEach(() => {
    cy.clearCookies()
  })

})
