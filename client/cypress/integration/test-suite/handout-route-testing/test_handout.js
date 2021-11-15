describe('SPG handout page', () => {

    it('open route', () => {
        cy.visit('http://localhost:3000/handout')
    })

    it('type a user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })
})