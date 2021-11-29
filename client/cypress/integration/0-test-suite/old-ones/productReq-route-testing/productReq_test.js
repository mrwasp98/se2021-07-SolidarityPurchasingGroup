describe('SPG product request page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/productRequest')
    })

    before(()=>{
        cy.visit('http://localhost:3000/productRequest')
        cy.get('.btn-hour').click()
        cy.get('.input-hour').clear().type('09')
        cy.get('.input-min').clear().type('01')
        cy.get('.submit-btn').click()
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, press add', () => {
        cy.visit('http://localhost:3000/productRequest')
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-1n7v3ny-option').click()
        cy.get('.add-btn-0').click()
        cy.contains('Total order')
    })

    it('type a valid user, press sub', () => {
        cy.get('.sub-btn-0').click()
        cy.contains('.alert-total').should('not.exist')
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})