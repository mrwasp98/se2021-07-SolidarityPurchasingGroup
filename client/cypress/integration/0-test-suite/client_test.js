//testing the client home
describe('SPG client home', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
        cy.get('.emailfield').type("client1@polito.it");
        cy.get('.passwordfield').type('qwerty123')
        cy.get('.loginbutton').click(); 
        cy.url().should('include', '/products')
    })

    it('select 25 Nov', () => {
        cy.get('.callandarButton').click()
        let notFound = true;
        let loop = 5;
        while (notFound && loop > 0) {
            cy.get('.react-calendar__navigation__label__labelText').then(($btn) => {
                // assert on the text
                if ($btn.text().includes('novembre 2021')) {
                    notFound = false;
                } else {
                    cy.get('.react-calendar__navigation__prev-button').click();
                }
            })
            loop--;
        }
        cy.contains('25').click()
        cy.get('.callandarButton').should("contain", " 25 Nov")
        cy.get('.btn-hour').click()
        cy.get('.input-hour').clear().type('12')
        cy.get('.input-min').clear().type('00')
        cy.get('.save-btn').click()
    })
})