describe('Open the SPG page', () => {
    it('Visits the SPG site', () => {
        cy.visit('http://localhost:3000/products')
    })
})

describe('Filter farmers present', () => {
    it('Visits the SPG site', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Select Farmers')
    })
})

describe('Filter navbar working', () => {
    it('Visits the SPG site', () => {
        cy.visit('http://localhost:3000/products')
        cy.contains('Latteria').click()
    })
})