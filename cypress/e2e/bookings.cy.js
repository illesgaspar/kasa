/// <reference types="cypress" />

describe('', () => {
    beforeEach(() => {
        cy.viewport(1920, 1080)
        cy.visit("http://kasa.com")
    })

    //Tested locations
    const locations = require('../fixtures/locations')

    let today = new Date()
    let tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    let afterTomorrow = new Date()
    afterTomorrow.setDate(tomorrow.getDate() + 1)
    let oneWeekEarlier = new Date()
    oneWeekEarlier.setDate(today.getDate() - 6)
    let oneWeekLater = new Date()
    oneWeekLater.setDate(today.getDate() + 6)

    locations.forEach((place) => {
        it('Search Kasas in given locations and verify the search result page loads', { scrollBehavior: 'center' }, () => {
            //Arrange
            let expectedUrlSearchString = place.replace(", ", '-').replace(" ", "-").toLowerCase()
            //Act
            cy.searchKasas(place, tomorrow, oneWeekLater)
            //Assert
            cy.location('href').should('contain', expectedUrlSearchString)
            cy.get('.list-page__header').find('.list-page__title').should('contain.text', place)
        })

        it('Verify it is not possible to book for 1-night stay', { scrollBehavior: 'center' }, () => {
            //Act
            cy.searchKasas(place, tomorrow, afterTomorrow)
            getKasas().first().find('.property-card__hero-hover').click()
            getRooms().first().find('.room-type-card__hero-hover').click()
            //Assert
            cy.get('.room-type-popup-availability__footer').find('button').should('not.contain.text', 'Book now')
            cy.get('.room-type-popup-availability').then(($availabilitySection) => {
                let retries = 5
                for (let index = 0; index < retries; index++) {
                    if ($availabilitySection.text().includes('This Kasa is not available on one or more of the dates you selected.')) {
                        //TODO: Either have a static date that we know is always available, or set an upper limit how many times we can retry
                        cy.log(`Retrying to find a date that is available for the ${index + 1}. time`)
                        setDateRoomPopUpUntilAvailable()
                    }
                    else {
                        break
                    }

                }
            }
            )
            cy.get('.room-type-popup-availability').should('include.text', 'Minimum 2-night stays.')
        }
        )

        it('Verify that a selected Kasa has "Heating" in the amenities list when a user visits the property details pages', { scrollBehavior: 'center' }, () => {
            //Act
            cy.searchKasas(place, tomorrow, oneWeekLater)
            getKasas().first().find('.property-card__hero-hover').click()
            getRooms().first().find('.room-type-card__hero-hover').click()
            cy.get('.room-type-popup__card').contains('Amenities').click()
            //Assert
            cy.get('[data-testid="room-type-section--amenities-toggle"]').should('include.text', 'Heating')
        })
    })

    it('Verify it is not possible to search for Kasas with date earlier than the next day', { scrollBehavior: 'center' }, () => {
        //Act
        cy.searchKasas(locations[0], oneWeekEarlier, today)
        //Assert
        cy.get('#full-screen-hero-invalid-dates-error').should('exist').and('have.text', '  Enter valid dates')
    })


    //Local actions therefore kept in test file.

    function getKasas() {
        return cy.get('.list-page__content-list').find('.property-card')
    }

    function getRooms() {
        return cy.get('.room-type-card')
    }

    function setDateRoomPopUpUntilAvailable() {
        cy.get('#room-type-popup-check-in-input').then(($dateInput) => {
            let date = new Date($dateInput.text())
            date.setDate(date.getDate() + 2)
            cy.wrap($dateInput).type(date)
        })
        cy.get('#room-type-popup-check-out-input').then(($dateInput) => {
            let date = new Date($dateInput.text())
            date.setDate(date.getDate() + 2)
            cy.wrap($dateInput).type(date + '{enter}')
        })
    }
})