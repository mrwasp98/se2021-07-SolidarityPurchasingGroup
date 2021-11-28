describe('SPG shop employee home', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/employeehome')
    })
    
    afterEach(() => {
            cy.visit('http://localhost:3000/employeehome')
        })

    it('goes to product request page', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/productRequest')
    })

    it('goes to register client page', () => {
        cy.get('#toregcl').click()
        cy.url().should('include', '/registerClient')
    })

    it('goes to wallet page', () => {
        cy.get('#topup').click()
        cy.url().should('include', '/wallet')
    })

})