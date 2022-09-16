/// <reference types="cypress" />

describe('Kasa love beers test cases', () => {


  chai.use(require('chai-like'));
  chai.use(require('chai-things'));

  const expectedYeast = 'American Ale'
  const expectedHops = 'Chinook'

  // If before does not work for some mysterious reason, try beforeEach.
  // Saves the Rest API response to the fixtures
  // before(() => {
  //   cy.getBeers(expectedYeast, expectedHops).then(response => {
  //     cy.writeFile('./cypress/fixtures/beers.json', response.body)
  //   })
  // })
  //let beers = require('../fixtures/beers')

  let beers
  before(() => {
    cy.getBeers(expectedYeast, expectedHops).then(response => {
      beers = response.body
    })
  })


  // Generates a separate test for each beer in the fixture
  Cypress._.range(0, 48).forEach((i) => {
    it('Test beer independently', () => {

      let beer = beers[i]

      cy.log(beer.name)
      cy.log(beer.yeast)

      //Any kind of cheese is recommended
      cy.log(`Testing whether the food paring mentions cheese in any way`)
      let isThereCheese = false
      beer.food_pairing.forEach((food) => {
        if (food.includes('cheese')) {
          cy.log(`${food} includes the word 'cheese'`)
          isThereCheese = true
        }
      })
      assert.isTrue(isThereCheese, 'Food recommendations does not include cheese')

      //Brewer tips include bourbon
      cy.log(`Testing whether the the brewer tips mentions bourbon in any way`)
      expect(beer.brewers_tips).to.contain('bourbon')
    })
  })
})

