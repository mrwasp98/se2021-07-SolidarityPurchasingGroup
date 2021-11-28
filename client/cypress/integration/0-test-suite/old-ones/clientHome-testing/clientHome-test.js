describe('SPG client home', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/clienthome')
    })
    
    afterEach(() => {
            cy.visit('http://localhost:3000/clienthome')
        })

    it('goes to products page', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/products')
    })

})