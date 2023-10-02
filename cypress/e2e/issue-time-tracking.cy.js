const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]')
const description = 'Test time tracking description.'
const title = 'Test time tracking'

describe('Issue time tracking functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true')
            cy.get('[data-testid="modal:issue-create"]').within(() => {
                cy.get('.ql-editor').type(description)
                cy.get('input[name="title"]').type(title)
                cy.get('button[type="submit"]').click()
            })
            cy.get('[data-testid="modal:issue-create"]').should('not.exist')
            cy.reload()
            cy.get('[data-testid="list-issue"]').contains(title).click();
            getIssueDetailsModal().should('be.visible')

        });
    });

    it('Possible to add, edit and delete issue estimated time', () => {
        //Estimated time is not logged by default; Log 10h
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]')
                .should('not.have.value')
                .click()
                .type(10)
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the added value stays visible
            cy.get('input[placeholder="Number"]')
                .should('have.value', 10)
            cy.get('[data-testid="icon:stopwatch"]')
                .next(1)
                .contains('10h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Previously logged time is visible; Edit 10 -> 20
        cy.get('[data-testid="list-issue"]').contains(title).click()

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]')
                .should('have.value', 10)
                .click()
                .clear()
                .type(20)
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the edited value stays visible
            cy.get('input[placeholder="Number"]')
                .should('have.value', 20)
            cy.get('[data-testid="icon:stopwatch"]')
                .next(1)
                .contains('20h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Previously edited time is visible; Delete time
        cy.get('[data-testid="list-issue"]').contains(title).click()

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]')
                .should('have.value', 20)
            cy.get('[data-testid="icon:stopwatch"]')
                .next(1)
                .contains('20h estimated')
            cy.get('input[placeholder="Number"]')
                .click()
                .clear()
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the field is empty
            cy.get('input[placeholder="Number"]')
                .should('not.have.value')
            cy.get('[data-testid="icon:stopwatch"]')
                .next(1)
                .should('not.contain', '20h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Estimated time is removed
        cy.get('[data-testid="list-issue"]').contains(title).click()

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]')
                .should('not.have.value')
            cy.get('[data-testid="icon:stopwatch"]')
                .next(1)
                .should('not.contain', '20h estimated')
        })
    })


    it('Possible to log time and remove logged time', () => {
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]').click().type(10)
            cy.get('[data-testid="icon:stopwatch"]').click()
        })

        //Log time
        cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
            cy.contains('No time logged')
            cy.get('input[placeholder="Number"]')
                .eq(0).should('not.have.value').click().type(2)
            cy.get('input[placeholder="Number"]')
                .eq(1).should('not.have.value').click().type(5)
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('2h logged')
                .next(1).contains('5h remaining')
            cy.contains('Done').click()
            cy.should('not.exist')
        })
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('2h logged')
                .next(1).contains('5h remaining')
            cy.get('[data-testid="icon:stopwatch"]').click()
        })
        //Remove previously logged time
        cy.get('[data-testid="modal:tracking"]').should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]')
                .eq(0).should('have.value', 2).click().clear()
            cy.get('input[placeholder="Number"]')
                .eq(1).should('have.value', 5).click().clear()
            cy.contains('No time logged')
            cy.contains('Done').click()
            cy.should('not.exist')
        })

        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('No time logged')
                .next(1).contains('10h estimated')
        })
    });
})