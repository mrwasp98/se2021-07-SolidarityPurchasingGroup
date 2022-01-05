//testing the client home
describe('SPG client home', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
        cy.url().should('include', '/login')
    })

    it('insert credentials', () => {
        cy.get('.emailfield').type("client1@polito.it");
        cy.get('.passwordfield').type('qwerty123')
        cy.get('.loginbutton').click(); 
        cy.url().should('include', '/products')

    })

    it('select the day', () => {
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
    })

    it('try to add to cart a product, 0 quantity', () => {
        cy.get('.cartButton').eq(1).click()
        cy.contains('Select a quantity first')
    })

    it('add quantity', () => {
        cy.get('.addButton').eq(1).click()
        cy.contains('0.5 kg')
    })

    it('try to add to cart a product, yes quantity', () => {
        cy.get('.cartButton').eq(1).click()
        cy.contains('Product has been added to cart')
    })

    it('verify cart', () => {
        cy.get('.cartNavButton').click()
        cy.contains('This is your basket')
        cy.get('.basketRow').should('have.length', 1)
    })

    it('update cart', () => {
        cy.get('.btn-close').eq(1).click()
        cy.get('.addButton').eq(0).click()
        cy.get('.cartButton').eq(0).click()
        cy.contains('Product has been added to cart')
        cy.get('.cartNavButton').click()
        cy.contains('This is your basket')
        cy.get('.basketRow').should('have.length', 2)
    })
})