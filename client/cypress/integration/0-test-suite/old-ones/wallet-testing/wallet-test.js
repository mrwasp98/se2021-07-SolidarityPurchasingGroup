describe('SPG wallet page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/wallet')
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, select amount', () => {
        cy.visit('http://localhost:3000/wallet')
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-1n7v3ny-option').click()
        cy.get('.submit-btn').click()
    })

    it('type a valid user with a valid amount', () => {
        cy.visit('http://localhost:3000/wallet')
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-1n7v3ny-option').click()
        cy.get('.input-amount').clear().type('1')
        cy.get('.submit-btn').click()
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})