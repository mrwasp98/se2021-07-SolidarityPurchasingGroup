describe('SPG handout page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/handout')
    })

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
        cy.visit('http://localhost:3000/products')
        cy.get('.rounded-circle').click()
        cy.url().should('include', '/')
    })

})

describe('SPG routes', () => {
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

import dayjs from 'dayjs'
import 'cypress-react-selector'
const today = dayjs(new Date).format("DD/MM/YYYY");

describe('SPG navbar', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/')
    })

    it('has the right brand', () => {
        cy.get('.myNav')
        cy.contains('SPG - Group 07')
    })

    it('has the right label and date', ()=>{
        cy.get('.callandarButton')
        cy.contains('Current Date: '+today)
    })

    it('has the right functions', () => {
        cy.get('.myNav')
        cy.contains('Login')
        cy.contains('Register')
    })

    it('changes the date correctly', () => {
        cy.get('.callandarButton').click()
        cy.get('.react-calendar')
        cy.contains('5').click()
        cy.get('.callandarButton').should("contain", '5/11/2021')
        cy.get('.callandarButton').click()
    })

     it('goes to login page', ()=>{
        cy.get('.loginLink').click()
        cy.url().should('include', '/login')
    }) 
    
    it('change status when logged in', ()=>{
        cy.get('.emailfield').clear().type("shopemployee");
        cy.get('.passwordfield').clear().type('qwerty123')
        cy.get('.loginbutton').click();
        cy.contains('Logout')
    })

    it('performs logout', ()=>{
        cy.get('#logoutbutton').click()
        cy.contains('Current Date: ')
        cy.contains('Login')
        cy.contains('Register')
    })

})

describe('SPG product show page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/products')
    })
    it('filter farmers button present', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Select Farmers')
    })
    it('filter navbar', () => {
        cy.visit('http://localhost:3000/products')
        cy.get('.myCard').its('length').should('be.gte', 1)
        cy.contains('Dairy').click()
        cy.get('.myCard').its('length').should('eq', 6)
        cy.get('.myCard').should('contain', 'Dairy')
        cy.get('.myCard').should('not.contain', 'Salame')
    })
    it('selected category', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Dairy').click()
        cy.get('.selected-items').should('contain', 'Dairy')
    })
    it('back to home', () => {
        cy.visit('http://localhost:3000/products')
        cy.get('.rounded-circle').click()
        cy.url().should('include', '/')
    })
})

describe('SPG product request page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/productRequest')
    })

    it('type a invalid user', () => {
        cy.get('.client-here')
            .type('unknown').should('have.value', '')
        cy.contains('No option')
    })

    it('type a valid user, back', () => {
        cy.get('.client-here').click().type('{enter}')
        cy.get('.back-btn').click()
        cy.url().should('include', '/')
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
})

describe('SPG register page', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/registerClient')
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
        cy.get('.email-input').type('antonioVes@poli.it')
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

})