//testing home
describe('SPG test home', () => {

    afterEach(() => {
        cy.visit('http://localhost:3000')
    })
    
    it('goes to product list', ()=>{
        cy.get('#homepage_browseproducts').click();
        cy.url().should('include', '/products')
    })

    it('goes to register', ()=>{
        cy.get('#homepage_joinus').click();
        cy.url().should('include', '/user')
    })
})
