describe('SPG login', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
    })

    // it('type in only email, no action', ()=>{
    //     cy.get('.emailfield').type("a@a.com");
    //     cy.get('.loginbutton').click();
    //     // cy.get('.passwordfield').should('satisfy', hasAtLeastOneClass(['is-invalid', 'was-validated']))
    //     //cy.get('.passwordfield').should('have.class', '.is-invalid')
    // })

    it("no username given", ()=>{
        cy.get('.loginbutton').click();
        cy.contains('Please insert a valid username.')
    })

    it('bad password message error', ()=>{
        cy.get('.emailfield').clear().type("shopemployee");
         cy.get('.passwordfield').type('aaa')
         cy.get('.loginbutton').click();
         cy.contains("The password must be at least 6 characters long and must contain both alphabetical and numerical values.")
    })

    it('invalid user', ()=>{
        cy.get('.passwordfield').clear().type('qwerty1')
         cy.get('.loginbutton').click();
         cy.contains("Wrong email or password! Try again")
    })

    it('valid user', ()=>{
        cy.get('.passwordfield').clear().type('qwerty123')
        cy.get('.loginbutton').click();
        cy.contains("Wrong email or password! Try again").should('not.exist')
    })
  
})