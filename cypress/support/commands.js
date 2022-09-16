// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
Cypress.Commands.addAll({

    //Search Kasas from the Home page
    searchKasas(place, startDate, endDate) {
        cy.get('#full-screen-hero-search-input').type(place)
        cy.get('#full-screen-hero-search-select-item-0').click()
        cy.selectDateByText(startDate, endDate)
        cy.get('.search-widget').contains('Search').click()
    },

    //Select given start and end date in home page date picker
    selectDateByText(startDate, endDate) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };

        startDate = startDate.toLocaleDateString('en-US', options)
        endDate = endDate.toLocaleDateString('en-US', options)

        cy.get('#full-screen-hero-check-in-input').type(startDate)
        cy.get('#full-screen-hero-check-out-input').type(endDate)
    },

    getBeers(expectedYeast, expectedHops) {
        const beerEndPoint = 'https://api.punkapi.com/v2/beers/'
        cy.request(beerEndPoint.concat(`?yeast=${expectedYeast.replace(' ', '_')}&hops=${expectedHops.replace(' ', '_')}&per_page=80`))
    }
})