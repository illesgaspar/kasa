/// <reference types="cypress" />

describe('Kasa love beers test cases', () => {


  chai.use(require('chai-like'));
  chai.use(require('chai-things'));


  const beerEndPoint = 'https://api.punkapi.com/v2/beers/'

  beforeEach(() => {
    const expectedYeast = 'Wyeast 3522 - Belgian Ardennes™'
    const expectedHops = 'Tomahawk'

    cy.getBeers(expectedYeast, expectedHops).then($response => {
      cy.wrap($response).its('body').its('0').as('beer')
    })
  })

  it('Verify that the selected beer has expected grams of Magnum hops', () => {
    const expected = { name: 'Magnum', amount: { value: 12.5, unit: 'grams' } }
    cy.get('@beer').then(($beer) => {
      expect($beer.ingredients.hops).to.be.an('array').that.contains.something.like(expected)
    })
  })
  it('Verify IBU is number type', () => {
    cy.get('@beer').then(($beer) => { expect($beer.ibu).to.be.a('number') })
  })
  it('Verify Description is not empty', () => {
    cy.get('@beer').then(($beer) => { expect($beer.description).to.be.not.empty })
  })
})

