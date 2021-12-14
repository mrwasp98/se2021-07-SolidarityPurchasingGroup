import dayjs from 'dayjs'
import 'cypress-react-selector'
import '@testing-library/cypress/add-commands'

let emailtest;

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
        emailtest = 'antonioVes' + Math.random() + '@poli.it'
        cy.get('.email-input').type(emailtest)
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

        cy.contains('The password must be at least 6 characters long and must contain both alphabetic and numerical values.').should('not.exist')
    })

    it('go to user/client/pasword', () => {
        cy.visit('http://localhost:3000/user')
        cy.get('#toCreateClient').click()
        cy.url().should('include', '/user/client')
        cy.get('#toCreatePassword').click()
        cy.url().should('include', 'user/client/password')
    })

    it('change password of a user that does not exists', () => {
        cy.get('#formBasicUsername').clear().type('inesistente@email.email.it')
        cy.get('#formBasicPassword').clear().type('testclient5')
        cy.get('#formBasicCPassword').clear().type('testclient5')
        cy.get('.confirm-btn').click()
        cy.contains('No username found')
    })

    it('change password of a user', () => {
        cy.get('#formBasicUsername').clear().type(emailtest)
        cy.get('.confirm-btn').click()
        cy.contains('No username found').should('not.exist')
        cy.url().should('include', '/login')
    })

})

//testing registration farmer
describe('SPG registration farmer', () => {
    it('go to user/farmer/pasword', () => {
        cy.visit('http://localhost:3000/user')
        cy.get('#toCreateFarmer').click()
        cy.url().should('include', '/user/farmer')
    })

    it('create new farmer, step 1', () => {
        cy.get('#formBasicName').clear().type('Rocco')
        cy.get('#formBasicSurname').clear().type('Guerra')
        cy.get('#formBasicPlace').clear().type('Azienda Vercelli')
        cy.get('#formBasicAddress').clear().type('Corso Francia 34, Vercelli, 13100 ')
        cy.get('.next-btn').click()
        cy.url().should('include', '/user/farmer')
    })

    it('create new farmer, step 2', () => {
        cy.get('#formBasicUsername').clear().type('RoccoGuerra@' + Math.random() + '.it')
        cy.get('#formBasicPassword').clear().type('qwerty123')
        cy.get('#formBasicCPassword').clear().type('qwerty123')
        cy.get('.confirm-btn').click()
        cy.url().should('include', '/login')
    })
})

//testing registration farmer
describe('SPG registration shopemployee', () => {
    it('go to user/user/shopemployee', () => {
        cy.visit('http://localhost:3000/user')
        cy.get('#toCreateShopEmployee').click()
        cy.url().should('include', '/user/shopemployee')
    })

    it('registration shopemployee, confirmation password is wrong', () =>{
        cy.get('#formBasicUsername').clear().type('shopemployeetest@' + Math.random() + '.it')
        cy.get('#formBasicPassword').clear().type('qwerty123')
        cy.get('#formBasicCPassword').clear().type('qwerty124')
        cy.get('.confirm-btn').click()
        cy.contains('Passwords are not equal')
    })

    it('registration shopemployee, confirmation', ()=>{
        cy.get('#formBasicCPassword').clear().type('qwerty123')
        cy.get('.confirm-btn').click()
        cy.url().should('include', '/login')
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

    // after(()=>{
    //     cy.get('.logoutButton').click();
    //     cy.url().should('include', '/')
    // })

})



//testing home
describe('SPG test home', () => {
  
    it('goes to home', ()=>{
        cy.visit('http://localhost:3000')

    })

    it('goes to product list', ()=>{
        cy.get('#homepage_browseproducts').click();
        cy.url().should('include', '/products')
    })

    it('goes to home', ()=>{
        cy.visit('http://localhost:3000')

    })

    it('goes to register', ()=>{
        cy.get('#homepage_joinus').click();
        cy.url().should('include', '/user')
    })
})

//testing login farmer
describe('SPG login (farmer)', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
    })

    it('farmer login', () => {
        cy.get('.emailfield').type("farmer2");
        cy.get('.passwordfield').type('qwerty123')
        cy.get('.loginbutton').click();
        cy.url().should('include', '/farmerhome')
    })
})

//testing edit product
describe('SPG farmer navigational steps', () => {
    it('click on edit', () => {
        cy.get('#productavailability_edit_1').click()
        cy.url().should('include', '/editProduct')
    })

    it('click on cancel', () => {
        cy.get('#productform_cancel').click()
        cy.url().should('include', '/farmerhome')
    })

    it('click on add product', () => {
        cy.get('#farmer_add_product').click()
        cy.url().should('include', '/addProduct')
    })

    it('click on cancel', () => {
        cy.get('#productform_cancel').click()
        cy.url().should('include', '/farmerhome')
    })

    it('click on expected availability', () => {
        cy.get('[href="#link2"]').click()
        cy.url().should('include', '/farmerhome#link2')
        cy.contains('Select the availability for the next week')
    })

    it('click on confirm preparation', () => {
        cy.get('[href="#link3"]').click()
        cy.url().should('include', '/farmerhome#link3')
        cy.contains('Confirm the preparation of a booked orders')
    })

    it('click on your products', () => {
        cy.get('[href="#link1"]').click()
        cy.url().should('include', '/farmerhome#link1')
        cy.contains('These are all your products')
    })
})

describe('SPG click on add product', () => {
    it('click on add product', () => {
        cy.get('#farmer_add_product').click()
        cy.url().should('include', '/addProduct')
        cy.contains('your product')
    })

    it('filling in the form, void', () => {
        cy.get('#productform_save').click()
        cy.contains("Name or description are empty")
    })

    it('filling in the form, incomplete, no picture', () => {
        cy.get('.productName').clear().type('Chicken')
        cy.get('.productDescr').clear().type('Very trustworthy description, I swear everything I write is right.')
        cy.get('.productCategory').select('Meat and Cold Cuts')
        cy.get('.productProduction').select('Local farm')
        cy.get('#formHorizontalRadios1').check()
        cy.get('#productform_save').click()
        cy.contains('Select an image for your product');
        cy.get('#productform_cancel').click()
    })
})

describe('SPG expected availability', () => {
    it('click on expected availability', () => {
        cy.get('[href="#link2"]').click()
        cy.url().should('include', '/farmerhome#link2')
        cy.contains('Select the availability for the next week')
    })

    it('press "+"', () => {
        cy.get('.add-btn-0').click().click()
        cy.contains('2 kg')
        cy.get('.add-btn-1').click()
        cy.contains('1 kg')
    })

    it('press "-"', () => {
        cy.get('.sub-btn-0').click()
        cy.contains('1 kg')
        cy.get('.sub-btn-1').click()
        cy.contains('0 kg')
    })
})

describe('SPG deleting product, but then go back', () => {
    it('click on delete', () => {
        cy.get('#productavailability_delete_1').click()
        cy.get('#modal_back').click()
        cy.contains("Parsley").should('exist')
    })
})

describe('SPG deleting product, for real', () => {
    it('click on delete', () => {
        cy.get('#productavailability_delete_1').click()
        cy.get('#modal_delete').click()
        cy.contains("Parsley").should('not.exist')
    })
})