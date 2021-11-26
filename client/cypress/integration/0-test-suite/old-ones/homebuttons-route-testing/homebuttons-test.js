describe('SPG login', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/')
    })

   
    it('goes to product request page', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/productRequest')
    })

    afterEach(() => {
        cy.visit('http://localhost:3000/')
    })

    it('goes to register client page', () => {
        cy.get('#toregcl').click()
        cy.url().should('include', '/registerClient')
    })


    it('goes to product page', () => {
        cy.get('#toprod').click()
        cy.url().should('include', '/products')
    })


    it('goes to handout page', () => {
        cy.get('#tohand').click()
        cy.url().should('include', '/handout')
    })

})