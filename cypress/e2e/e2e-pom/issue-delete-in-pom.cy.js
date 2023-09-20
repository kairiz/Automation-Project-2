
import { th } from "@faker-js/faker";
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {

    cy.contains(issueTitle).click();
    });
  });

  const issueTitle = 'This is an issue of type: Task.'
  const expectedAmountOfIssues3 = '3'
  const expectedAmountOfIssues4 = '4'

  it('Should delete issue successfully', () => {
    IssueModal.clickDeleteButton()
    IssueModal.confirmDeletion()
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle)
    IssueModal.expectedAmountIssues(expectedAmountOfIssues3)
  });

  it('Should cancel deletion process successfully', () => {
    IssueModal.clickDeleteButton()
    IssueModal.cancelDeletion()
    IssueModal.closeDetailModal()
    IssueModal.expectedAmountIssues(expectedAmountOfIssues4)
  });
});