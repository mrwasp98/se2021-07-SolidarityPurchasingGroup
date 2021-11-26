describe('SPG handout page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/handout')
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, no order', () => {
        cy.get('.client-here').click().type('{enter}')
        cy.contains('There is no order to be handed out.')
    })

    it('type a valid user, many orders', () => {
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-1n7v3ny-option').click()
        cy.contains('Then, select the order.')
    })
    
    it('back to home', () => {
        cy.visit('http://localhost:3000/products')
        cy.get('.rounded-circle').click()
        cy.url().should('include', '/')
    })

})