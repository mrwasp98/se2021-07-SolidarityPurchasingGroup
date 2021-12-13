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

    it('click on cancel', () =>{
        cy.get('#productform_cancel').click()
        cy.url().should('include', '/farmerhome')
    })

    it('click on add product', ()=>{
        cy.get('#farmer_add_product').click()
        cy.url().should('include', '/addProduct')
    })
    
    it('click on cancel', () =>{
        cy.get('#productform_cancel').click()
        cy.url().should('include', '/farmerhome')
    })
})

describe('SPG deleting product', ()=>{
    it('click on delete', () => {
        cy.get('#productavailability_delete_1').click()
        cy.contains("Parsley").should('not.exist')
    })
})

 //productform_save  