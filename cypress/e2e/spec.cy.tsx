describe('spec.cy.tsx', () => {
  it('pagination is working', () => {
    cy.visit('http://localhost:3000/')
    cy.get('[data-cy="plus"]').click()
    cy.contains('CASSIOPE')
    cy.get('[data-cy="minus"]').click()
    cy.contains('FalconSat')
  })
})

export {}