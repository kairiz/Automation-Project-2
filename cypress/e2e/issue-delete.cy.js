describe('Issue deleting', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();
      cy.url()
      cy.get('[data-testid="modal:issue-details"]').should('be.visible')
    });
  });

  //Assignment 3.2 Test Case 1: Issue Deletion
  it('Should delete an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:trash"]').click()
    })

    cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
      cy.get('button').eq(0).should('have.text', 'Delete issue').click()
    })
    
    cy.get('[data-testid="modal:modal:confirm"]').should('not.exist')
    
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '3')
        .and('not.contain', 'This is an issue of type: Task.')
    });
  });

  //Assignment 3.3 Test Case 2: Issue Deletion Cancellation
  it('Should cancel the deletion process and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-details"]').within(() => {
      cy.get('[data-testid="icon:trash"]').click()
    })

    cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
      cy.get('button').eq(1).should('have.text', 'Cancel').click()
    })

    cy.get('[data-testid="modal:modal:confirm"]').should('not.exist')
    cy.get('[data-testid="icon:close"]').eq(0).click()
    
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '4')
        .and('contain', 'This is an issue of type: Task.')
    });
  });  
})
