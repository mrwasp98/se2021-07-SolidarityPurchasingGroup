//testing login farmer
describe('SPG login (farmer)', () => {
    it('open route', () => {
        cy.visit('http://localhost:3000/login')
    })

    it('farmer login', () => {
        cy.get('.emailfield').type("farmer2@polito.it");
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
    })
    
    it('select wrong day', () => {
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
        cy.get('.callandarButton').should("contain", "28 Nov")
        cy.get('.btn-hour').click()
        cy.get('.input-hour').clear().type('12')
        cy.get('.input-min').clear().type('00')
        cy.get('.save-btn').click()
        cy.contains('You can do the estimation by monday at 9:00 am')
    })

    it('day ok', () => {
        cy.get('.callandarButton').click()
        cy.contains('29').click()
        cy.get('.callandarButton').should("contain", "29 Nov")
        cy.get('.btn-hour').click()
        cy.get('.input-hour').clear().type('10')
        cy.get('.input-min').clear().type('00')
        cy.get('.save-btn').click()
        cy.contains("You can do the estimation by monday at 9:00 am").should('not.exist')
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