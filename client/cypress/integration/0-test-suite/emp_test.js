import dayjs from 'dayjs'
import 'cypress-react-selector'
import '@testing-library/cypress/add-commands'

//testing the shop employee login
describe('SPG login (shopemployee)', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
    })

    it("no username given", () => {
        cy.get('.loginbutton').click();
        cy.contains('Please insert a valid username.')
    })

    it('bad password message error', () => {
        cy.get('.emailfield').clear().type("shopemployee");
        cy.get('.passwordfield').type('aaa')
        cy.get('.loginbutton').click();
        cy.contains("The password must be at least 6 characters long and must contain both alphabetical and numerical values.")
    })

    it('invalid user', () => {
        cy.get('.passwordfield').clear().type('qwerty1')
        cy.get('.loginbutton').click();
        cy.contains("Wrong email or password! Try again")
    })

    it('valid user', () => {
        cy.get('.passwordfield').clear().type('qwerty123')
        cy.get('.loginbutton').click();
        cy.contains("Wrong email or password! Try again").should('not.exist')
        cy.url().should('include', '/employeehome')
    })

})

//testing the navigational steps for the shop employee
describe('SPG shop employee routes', () => {

    afterEach(() => {
        cy.get('.home-here').click()
        cy.url().should('include', '/employeehome')
    })

    it('goes to product request page', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/productRequest')
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

    it('goes to wallet page', () => {
        cy.get('#topup').click()
        cy.url().should('include', '/wallet')
    })
})

//testing wallet page
describe('SPG wallet page', () => {
    let val;
    it('open route', () => {
        cy.contains('Logout')
        cy.get('#topup').click()
        cy.contains('Logout')
        cy.url().should('include', '/wallet')
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, select amount', () => {
        cy.get('.client-here').click().type('Loren')
        cy.findByText('Lorenzo Rossi - Via Lagrange, 3, 10128, Torino, TO').click()
        cy.get('.submit-btn').click()
    })

    it('type a valid user with a valid amount', () => {
        cy.get('.input-amount').clear().type('1')
        cy.get('.form-control-plaintext').invoke('val').then(value => val = value);
        cy.get('.submit-btn').click()
    })

    it('check update', () => {
        cy.get('.client-here').click().type('Loren')
        cy.findByText('Lorenzo Rossi - Via Lagrange, 3, 10128, Torino, TO').click()
        cy.contains(val).should('not.exist')
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})

//testing handout page
describe('SPG handout page', () => {
    it('open route', () => {
        cy.get('#tohand').click()
        cy.url().should('include', '/handout')
    })

    it('wrong day for pickups', () => {
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
        cy.contains('27').click()
        cy.get('.callandarButton').should("contain", " 27 Nov")
        cy.contains('Pickups take place from Wednesday')
    })

    it('rigth day for pickups', () => {
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

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, no order', () => {
        cy.get('.client-here').type('Anton')
        cy.findByText('Antonio Ferragnez - Via Napoleone 29').click()
        cy.contains('There is no order to be handed out.')
    })

    it('type a valid user, many orders', () => {
        cy.get('.client-here').type('Loren')
        cy.findByText('Lorenzo Rossi - Via Lagrange, 3, 10128, Torino, TO').click()
        cy.contains('Then, select the order.')
    })

    it('handout', () => {
        let value;
        cy.get('.accordion-button').find('span:contains("pending")').then((el) =>{
            value = Cypress.$(el).length
        })
        cy.get('span:contains("pending")').first().click()
        cy.get('button:contains("Confirm Handout")').first().click()
        cy.get('button:contains("Confirm Handout")').should('have.length', value)
    })

    it('back to home', () => {
        cy.get('.test-back-btn').click()
        cy.url().should('include', '/employeehome')
    })

    after(() => {
        cy.get('.logoutButton').click();
        cy.url().should('include', '/')
    })
})
