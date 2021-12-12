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

//testing product request page
describe('SPG manage pending cancelation', () => {
    it('open route', () => {
        cy.findByText('Manage orders pending cancelation').click()
        cy.url().should('include', '/manageOrders')
        cy.contains('The following orders have failed')
    })

    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
    })
})

//testing product request page
describe('SPG product request page', () => {
    it('open route', () => {
        cy.get('#toprodreq').click()
        cy.url().should('include', '/productRequest')
    })

    it('wrong day for request', () => {
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
        cy.contains('Orders will be available after Saturday morning at 9 am')
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
        cy.contains('28').click()
        cy.get('.callandarButton').should("contain", " 28 Nov")
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

    it('make an order, no amount', () => {
        cy.get('.order-btn').click()
        cy.contains('Please, select date and time to pick up your order').should('exist')
        cy.get('.react-datepicker__input-container>input').click()
        let notFound = true;
        let loop = 5;
        while (notFound && loop > 0) {
            cy.get('.react-datepicker__current-month').then(($btn) => {
                // assert on the text
                if ($btn.text().includes('November 2021')) {
                    notFound = false;
                } else {
                    cy.get('.react-datepicker__navigation--previous').click();
                }
            })
            loop--;
        }
        cy.get('.react-datepicker__day--001').eq(1).click()
        cy.findByText('Check and Order').click()
        cy.contains('Select the amount of at least one product').should('exist')
    })

    it('make an order, with amount', () => {
        cy.get('.add-btn-0').click()
        cy.get('.order-btn').click()
        cy.contains('Please, select date and time to pick up your order').should('exist')
        cy.get('.react-datepicker__input-container>input').click()
        let notFound = true;
        let loop = 5;
        while (notFound && loop > 0) {
            cy.get('.react-datepicker__current-month').then(($btn) => {
                // assert on the text
                if ($btn.text().includes('November 2021')) {
                    notFound = false;
                } else {
                    cy.get('.react-datepicker__navigation--previous').click();
                }
            })
            loop--;
        }
        cy.get('.react-datepicker__day--001').eq(1).click()
        cy.findByText('Check and Order').click()
        cy.contains('Order received!').should('exist')
        cy.findByText('Ok').click()
    })

    it('make an order, with delivery', () => {
        cy.get('.add-btn-0').click()
        cy.get('.order-btn').click()
        cy.get('#checkdelivery').click()
        cy.contains('Please, select date and time to pick up your order').should('exist')
        cy.get('.react-datepicker__input-container>input').click()
        let notFound = true;
        let loop = 5;
        while (notFound && loop > 0) {
            cy.get('.react-datepicker__current-month').then(($btn) => {
                // assert on the text
                if ($btn.text().includes('November 2021')) {
                    notFound = false;
                } else {
                    cy.get('.react-datepicker__navigation--previous').click();
                }
            })
            loop--;
        }
        cy.get('.react-datepicker__day--001').eq(1).click()
        cy.findByText('Check and Order').click()
        cy.contains('Order received!').should('exist')
        cy.findByText('Ok').click()
    })


    it('back to home', () => {
        cy.get('.home-here').click()
        cy.url().should('include', '/')
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
    let value;
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
        cy.findByText('Antonio Ferragnez - via San Severo, 3').click()
        cy.contains('There is no order to be handed out.')
    })

    it('type a valid user, many orders', () => {
        cy.get('.client-here').type('Loren')
        cy.findByText('Lorenzo Rossi - Via Lagrange, 3, 10128, Torino, TO').click()
        cy.contains('Then, select the order.')
    })

    it('handout', () => {
        cy.get('.accordion-button').find('span:contains("pending")').then((elements) => {
            value = elements.length;
        }).then(() => {
            cy.get('.accordion-button').find('span:contains("pending")').should('have.length', value)
            cy.get('span:contains("pending")').first().click()
            cy.get('button:contains("Confirm Handout")').first().click()
            cy.get('.accordion-button').find('span:contains("pending")').should('have.length',value - 1)
        })
    })

    it('back to home', () => {
        cy.get('.test-back-btn').click()
        cy.url().should('include', '/employeehome')
    })
})


//testing products page
describe('SPG product show page', () => {
    it('open route', () => {
        cy.get('#toprod').click()
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
    it('filter farmers', () => {
        cy.get('.farmers-filter').click()
        cy.get('.form-check-input').first().click()
        cy.get('.another-product').its('length').should('eq', 1)
        cy.get('.form-check-input').eq(1).click()
        cy.get('.another-product').should('not.exist')
        cy.get('.btn-close').click()
    })
    it('back to home', () => {
        cy.get('.test-back-btn').click()
        cy.url().should('include', '/employeehome')
    })
})

//testing register page
describe('SPG register page', () => {
    before(() => {
        cy.get('#toregcl').click()
        cy.url().should('include', '/registerClient')
    })


    it('type a invalid name', () => {
        cy.get('.submit-btn').click()
        cy.contains('The user has been created').should('not.exist')
    })

    it('type a invalid surname', () => {
        cy.get('.name-input').type('Marco')
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

//testing registration client
describe('SPG registration client', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/user')
    })

    it('go to register page', () => {
        cy.get('#toCreateClient').click()
        cy.url().should('include', '/user/client')
    })

    it('go to create client page', () => {
        cy.get('#toCreateNewClient').click()
        cy.url().should('include', '/user/client')
        cy.get('#formBasicName').clear().type('Ajeje')
        cy.get('#formBasicSurname').clear().type('Brazorf')
        cy.get('#formBasicAddress').clear().type('Corso Francia 34')
        cy.get('.next-btn').click()
    })


    it('type a username that just exists', () => {
        cy.get('#formBasicUsername').clear().type('CuginoDiBrazorf@3u1g.it')
        cy.get('#formBasicPassword').clear().type('AjejeBraz123')
        cy.get('#formBasicCPassword').clear().type('AjejeBraz123')
        cy.get('.confirm-btn').click()
        cy.contains('Username already used').should('exist')
    })

    it('type a bad password', () => {
        cy.get('#formBasicUsername').clear().type('CuginoDiBrazorf@' + Math.random() + '.it')
        cy.get('#formBasicPassword').clear().type('Ajeje')
        cy.get('#formBasicCPassword').clear().type('Ajeje')
        cy.get('.confirm-btn').click()
        cy.contains('The password must be at least 6 characters long and must contain both alphabetic and numerical values.').should('exist')
    })


    it('type a valid password', () => {
        cy.get('#formBasicPassword').clear().type('Ajeje123')
        cy.get('#formBasicCPassword').clear().type('Ajeje123')
        cy.get('.confirm-btn').click()
        cy.contains('The password must be at least 6 characters long and must contain both alphabetic and numerical values.').should('not.exist')    })

})