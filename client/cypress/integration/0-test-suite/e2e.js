/* CRYPRESS TESTS :
TODO: use a mock db */

import dayjs from 'dayjs'
import 'cypress-react-selector'
const today = dayjs(new Date).format("DD/MM/YYYY");

var isoWeek = require('dayjs/plugin/isoWeek')

dayjs.extend(isoWeek)

//testing the navbar
describe('SPG navbar', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/')
    })

    it('has the right brand', () => {
        cy.get('.myNav')
        cy.contains('SPG - Group 07')
    })
})

describe('SPG virtual clock', () => {

    it('has the right label and date', () => {
        cy.get('.callandarButton')
        cy.contains(dayjs().format('ddd DD MMM').toString())
    })

    it('has the right functions', () => {
        cy.get('.myNav')
        cy.contains('Login')
        cy.contains('Register')
    })

    it('changes the date correctly', () => {
        cy.get('.callandarButton').click()
        cy.get('.react-calendar')
        cy.contains('19').click()
    })
})

describe('SPG login', () => {

    it('goes to login page', () => {
        cy.get('.loginLink').click()
        cy.url().should('include', '/login')
    })

    it('change status when logged in', () => {
        cy.get('.emailfield').clear().type("shopemployee");
        cy.get('.passwordfield').clear().type('qwerty123')
        cy.get('.loginbutton').click();
        cy.contains('Logout')
    })
})

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

//testing product request page
describe('SPG product request page', () => {
    it('open route', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/productRequest')
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, press add', () => {
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

//testing register page
describe('SPG register page', () => {

    before(()=>{
        cy.get('#toregcl').click()
        cy.url().should('include', '/registerClient')
        cy.get('.callandarButton').click()
        cy.get('.react-calendar')
        cy.contains('19').click()
        cy.get('.btn-hour').click()
        cy.get('.input-hour').clear().type('12')
        cy.get('.input-min').clear().type('00')
        cy.get('.save-btn').click()
    })


    it('type a invalid name', () => {
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a invalid surname', () => {
        cy.get('.name-input').type('Antonio')
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a invalid email', () => {
        cy.get('.surname-input').type('Ferragnez')
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a invalid wallet', () => {
        cy.get('.email-input').type('antonioVes' + Math.random() + '@poli.it')
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a invalid address', () => {
        cy.get('.wallet-input').type('10')
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a valid address', () => {
        cy.get('.address-input').type('Via Napoleone 29')
        cy.contains('.alert-success').should('not.exist')
    })

    it('register succefully', () => {
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('exist')
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})

//testing wallet page
describe('SPG wallet page', () => {
    
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
        cy.get('.css-1n7v3ny-option').click()
        cy.get('.submit-btn').click()
    })

    it('type a valid user with a valid amount', () => {
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-9gakcf-option').click()
        cy.get('.input-amount').clear().type('1')
        cy.get('.submit-btn').click()
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})

//testing products page
describe('SPG product show page', () => {
    it('open route', () => {
        cy.get('#toprod').click()
        cy.url().should('include', '/products')
    })

    it('gets more products', () => {
        cy.get('.callandarButton').click()
        cy.get('.react-calendar')
        cy.contains('23').click()
        cy.get('.callandarButton').should("contain", " 23 Nov")
    })

    it('filter farmers button present', () => {
        cy.get('.farmers-filter')
    })
    it('filter navbar', () => {
        cy.get('.another-product').its('length').should('be.gte', 1)
        cy.get('.another-product').its('length').should('eq', 4)
        cy.contains('Fruit and Vegetables').click()
        cy.get('.another-product').its('length').should('eq', 1)
        cy.contains('All').click()
        cy.get('.another-product').its('length').should('eq', 4)
        //cy.get('.another-product').should('not.contain', 'Dairy')
    })
    it('selected category', () => {
        cy.contains('Fruit and Vegetables').click()
        cy.get('.selected-items').should('contain', 'Fruit and Vegetables')
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

    if (today.day !== "Friday") {
        it('shows a error message', () => {
            cy.contains('Pickups take place from Wednesday morning at 9 am until Friday evening at 7 pm')
        })
        it('changes the date', () => {
            cy.get('.callandarButton').click()
            cy.get('.react-calendar')
            cy.contains('19').click()
        })
    }

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, no order', () => {
        cy.get('.client-here').click().type('{enter}')
        cy.contains('There is no order to be handed out.')
    })

    it('type a valid user, many orders', () => {
        cy.get('.client-here').click().type('Loren')
        cy.get('.css-1n7v3ny-option').click()
        cy.contains('Then, select the order.')
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




/* describe('performs logout', ()=>{
    it('performs logout', () => {
        cy.get('#logoutbutton').click()
        cy.contains('Current Date: ')
        cy.contains('Login')
        cy.contains('Register')
    })
}) */