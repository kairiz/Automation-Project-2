const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')



describe('Issue details editing', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
      cy.url()
      cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    });
  });

  it('Should update type, status, assignees, reporter, priority successfully', () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click('bottomRight');
      cy.get('[data-testid="select-option:Story"]')
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="select:type"]').should('contain', 'Story');

      cy.get('[data-testid="select:status"]').click('bottomRight');
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should('have.text', 'Done');

      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click('bottomRight');
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should('contain', 'Baby Yoda');
      cy.get('[data-testid="select:assignees"]').should('contain', 'Lord Gaben');

      cy.get('[data-testid="select:reporter"]').click('bottomRight');
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should('have.text', 'Pickle Rick');

      cy.get('[data-testid="select:priority"]').click('bottomRight');
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should('have.text', 'Medium');
    });
  });

  it('Should update title, description successfully', () => {
    const title = 'TEST_TITLE';
    const description = 'TEST_DESCRIPTION';

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get('.ql-snow')
        .click()
        .should('not.exist');

      cy.get('.ql-editor').clear().type(description);

      cy.contains('button', 'Save')
        .click()
        .should('not.exist');

      cy.get('textarea[placeholder="Short summary"]').should('have.text', title);
      cy.get('.ql-snow').should('have.text', description);
    });
  });

  const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');


  it('Should validate values in issue priorities', () => {
    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')
    const expectedLength = 5
    const priorities = ["Lowest", "Low", "Medium", "High", "Highest"]

    getIssueDetailsModal()
      .get('[data-testid="select:priority"]').click()
  })

  it.only('Should validate reporters name', () => {
    function reporter(){
      cy.get('[data-testid="select:reporter"]')
        .children()
        .children()
        .next()
        .contains('Baby Yoda')
    }
    //const reporter1 = cy.get('[data-testid="select:reporter"] > .sc-eerKOB > .sc-emmjRN').contains('Baby Yoda')
    const regex = /[A-Za-z]\s/
    const regex2 = /^[A-Za-z\s]$/
    const reporter2 = ["Baby Yoda"]

    cy.get(reporter).should('match', regex)
    
  })

  it('Should validate reporters name', () => {
    const reporter = cy.get('[data-testid="select:reporter"]').children().children().next().contains('Baby Yoda')
    //const reporter1 = cy.get('[data-testid="select:reporter"] > .sc-eerKOB > .sc-emmjRN').contains('Baby Yoda')
    const regex = /[A-Za-z]\s/
    const regex2 = /^[A-Za-z\s]$/
    const reporter2 = ["Baby Yoda"]

    cy.get(reporter).should('match', regex2)
    
  })
})
