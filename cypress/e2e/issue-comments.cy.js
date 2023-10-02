describe('Issue comments creating, editing and deleting', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board');
            cy.contains('This is an issue of type: Task.').click();
        });
    });

    const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]');
    const comment = 'Test comment 123.';
    const newComment = 'New test comment 456.'

    //Assignment 1: Comments functionality 
    it.only('Should create, update and delete a comment successfully', () => {
        //Cancel the adding a comment process
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.contains('Add a comment...')
                .click()
            cy.get('textarea[placeholder="Add a comment..."]')
                .type(comment)
            cy.contains('button', 'Save')
                .should('be.visible')
            cy.contains('button', 'Cancel')
                .should('be.visible')
                .click()
                .should('not.exist')
            cy.contains('Add a comment...')
                .should('exist')
            cy.get('[data-testid="issue-comment"]')
                .should('not.contain', comment);
        })

        //Add a comment
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.contains('Add a comment...')
                .click()
            cy.contains('button', 'Save')
                .should('be.visible')
                .click()
                .should('not.exist')
            cy.contains('Add a comment...')
                .should('exist')
            cy.get('[data-testid="issue-comment"]')
                .should('contain', comment);
        })

        //Edit a comment
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="issue-comment"]')
                .eq(0)
                .contains('Edit')
                .click()
                .should('not.exist')
            cy.get('textarea[placeholder="Add a comment..."]')
                .should('contain', comment)
                .clear()
                .type(newComment)
            cy.contains('button', 'Save')
                .click()
                .should('not.exist')
            cy.get('[data-testid="issue-comment"]')
                .eq(0)
                .should('contain', newComment)
            cy.get('[data-testid="issue-comment"]')
                .should('not.contain', comment)
        })

        //Cancel the deletetion process (extra)
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="issue-comment"]')
                .contains(newComment)
            cy.get('[data-testid="issue-comment"]')
                .eq(0)
                .contains('Delete')
                .click()
        })

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
            cy.contains('button', 'Cancel')
                .click()
                .should('not.exist')
        })

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="issue-comment"]')
                .contains(newComment)
        })

        //Delete a comment
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="issue-comment"]')
                .contains(newComment)
            cy.get('[data-testid="issue-comment"]')
                .eq(0)
                .contains('Delete')
                .click()
        })

        cy.get('[data-testid="modal:confirm"]').should('be.visible').within(() => {
            cy.contains('button', 'Delete comment')
                .click()
                .should('not.exist')
        })

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="issue-comment"]')
                .should('not.contain', newComment)
        });
    })
});
