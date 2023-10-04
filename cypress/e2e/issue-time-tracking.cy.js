function newIssue(){
    cy.get('[data-testid="modal:issue-create"]')
    cy.get('.ql-editor').type(description)
    cy.get('input[name="title"]').type(title)
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
}
const getIssueDetailsModal = () => cy.get('[data-testid="modal:issue-details"]').should('be.visible')
const TimeTrackingModal = () => cy.get('[data-testid="modal:tracking"]').should('be.visible')
const description = 'Test time tracking description.'
const title = 'Test time tracking'
const value = 10
const newValue = 20
const timeSpent = 2
const timeRemaining = 5

describe('Issue time tracking functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
            cy.visit(url + '/board?modal-issue-create=true')
            newIssue()
            cy.reload()
            cy.get('[data-testid="list-issue"]').contains(title).click();
            getIssueDetailsModal().should('be.visible')
        });
    });

    it('Possible to add, edit and delete issue estimated time', () => {
        //Estimated time is not logged by default; Add 10h
        getIssueDetailsModal().should('be.visible').within(() => {
            cy.get('input[placeholder="Number"]').should('not.have.value').click().type(value)
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the added value stays visible
            cy.get('input[placeholder="Number"]').should('have.value', value)
            cy.get('[data-testid="icon:stopwatch"]').next(1).contains('10h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Previously logged time is visible; Edit 10 -> 20
        cy.get('[data-testid="list-issue"]').contains(title).click()
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]').should('have.value', value).click().clear().type(newValue)
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the edited value stays visible
            cy.get('input[placeholder="Number"]').should('have.value', newValue)
            cy.get('[data-testid="icon:stopwatch"]').next(1).contains('20h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Previously edited time is visible; Delete time
        cy.get('[data-testid="list-issue"]').contains(title).click()
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]').should('have.value', newValue)
            cy.get('[data-testid="icon:stopwatch"]').next(1).contains('20h estimated')
            cy.get('input[placeholder="Number"]').click().clear()
            cy.contains('Original Estimate (hours)').click() //Click somewhere on the page to make sure the field is empty
            cy.get('input[placeholder="Number"]').should('not.have.value')
            cy.get('[data-testid="icon:stopwatch"]').next(1).should('not.contain', '20h estimated')
            cy.get('[data-testid="icon:close"]').click()
            cy.should('not.exist')
        })

        //Estimated time is removed
        cy.get('[data-testid="list-issue"]').contains(title).click()
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]').should('not.have.value')
            cy.get('[data-testid="icon:stopwatch"]').next(1).should('not.contain', '20h estimated')
        })
    })

    
    it('Possible to log time and remove logged time', () => {
        getIssueDetailsModal().within(() => {
            cy.get('input[placeholder="Number"]').click().type(value)
            cy.get('[data-testid="icon:stopwatch"]').click()
        })

        //Log time
        TimeTrackingModal().within(() => {
            cy.contains('No time logged')
            cy.get('input[placeholder="Number"]').eq(0).should('not.have.value').click().type(timeSpent)
            cy.get('input[placeholder="Number"]').eq(1).should('not.have.value').click().type(timeRemaining)
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('2h logged')
                .next(1).contains('5h remaining')
            cy.contains('Done').click()
            cy.should('not.exist')
        })

        //Validate logged time in visible
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('2h logged')
                .next(1).contains('5h remaining')
            cy.get('[data-testid="icon:stopwatch"]').click()
        })

        //Remove previously logged time
        TimeTrackingModal().within(() => {
            cy.get('input[placeholder="Number"]').eq(0).should('have.value', timeSpent).click().clear()
            cy.get('input[placeholder="Number"]').eq(1).should('have.value', timeRemaining).click().clear()
            cy.contains('No time logged')
            cy.contains('Done').click()
            cy.should('not.exist')
        })
        //Validate logged time is removed
        getIssueDetailsModal().within(() => {
            cy.get('[data-testid="icon:stopwatch"]')
                .next().contains('No time logged')
                .next(1).contains('10h estimated')
        })
    });
})