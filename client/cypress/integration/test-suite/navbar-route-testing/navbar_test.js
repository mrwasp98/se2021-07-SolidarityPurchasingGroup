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

   /*  it('shows logout', ()=>{
        cy.waitForReact()
        cy.react('MyNav').invoke('props.setLogged', { isLogin: true })

    }) */


     it('goes to login page', ()=>{
        cy.get('.loginLink').click()
        cy.url().should('include', '/login')
    }) 
})