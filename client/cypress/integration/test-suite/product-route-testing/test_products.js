describe('SPG product show page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/products')
    })
    it('filter farmers button present', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Select Farmers')
    })
    it('filter navbar', () => {
        cy.visit('http://localhost:3000/products')
        cy.get('.myCard').its('length').should('be.gte', 1)
        cy.contains('Latteria').click()
        cy.get('.myCard').its('length').should('eq', 1)
        cy.get('.myCard').should('contain', 'Latteria')

    })
    it('selected category', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Latteria').click()
        cy.get('.selected-items').should('contain', 'Latteria')
    })
    it('back to home', () => {
        cy.visit('http://localhost:3000/products')
        cy.get('.rounded-circle').click()
        cy.url().should('include', '/')
    })
})