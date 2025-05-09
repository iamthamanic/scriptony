
describe('Basic page test', () => {
  it('should load the application correctly', () => {
    cy.visit('/');
    cy.contains('Skript-Projekte').should('be.visible');
  });
});
