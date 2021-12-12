//testing the client home
describe('SPG client home', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
        cy.get('.emailfield').type("client1");
        cy.get('.passwordfield').type('qwerty123')
        cy.get('.loginbutton').click(); 
        cy.url().should('include', '/clienthome')
    })

    it('goes to product page', () => {
        cy.get('#toprod').click()
        cy.url().should('include', '/products')
    })

    it('goes to home client', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/clienthome')
    })

    after(()=>{
        cy.get('.logoutButton').click();
        cy.url().should('include', '/')
    })

})