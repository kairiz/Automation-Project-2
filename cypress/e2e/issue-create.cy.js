import { faker } from '@faker-js/faker'

const words = faker.lorem.words()
const word = faker.lorem.word()

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });


  it('Should create an issue and validate it successfully', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type('TEST_TITLE');

      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    //Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      //Assert that this list contains 5 issues and first element with tag p has specified text
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains('TEST_TITLE');
      //Assert that correct avatar and type icon are visible
      cy.get('[data-testid="avatar:Lord Gaben"]').should('be.visible');
      cy.get('[data-testid="icon:story"]').should('be.visible');
    });
  });

  //Assignment 2.2 Test Case 1: Custon Issue Creation
  it('Should create an issue and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type('My bug description')
      cy.get('input[name="title"]').type('Bug')

      cy.get('[data-testid="select:type"]').click()
      cy.get('[data-testid="select-option:Bug"]').click()

      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Highest"]').click()

      cy.get('[data-testid="select:reporterId"]').click()
      cy.get('[data-testid="select-option:Pickle Rick"]').click()

      cy.get('button[type="submit"]').click()
    });

    cy.get('[data-testid="modal:issue-create"]').should('not.exist')
    cy.contains('Issue has been successfully created.').should('be.visible')
    cy.reload()
    cy.contains('Issue has been successfully created.').should('not.exist')

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .eq(0)
        .find('p')
        .contains('Bug');

      cy.get('[data-testid="icon:bug"]').should('be.visible');
    });
  });

  //Assignment 2.3 Test Case 2: Random Data Plugin Issue Creation
  it('Should create an issue (using faker) and validate it successfully', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('.ql-editor').type(words)
      cy.get('input[name="title"]').type(word)
      cy.get('[data-testid="select:type"]').should('contain', 'Task')

      cy.get('[data-testid="select:priority"]').click()
      cy.get('[data-testid="select-option:Low"]').click()

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      cy.get('button[type="submit"]').click();
    })

    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
        .should('have.length', '5')
        .first()
        .find('p')
        .contains(word)
    })

    cy.get('[data-testid="board-list:backlog').within(() => {
      cy.get('[data-testid="list-issue"]').eq(0).within(() => {
      cy.get('[data-testid="icon:arrow-down"]').should('be.visible')
      .get('[data-testid="icon:task"]').should('be.visible')
      });
    });

    
  it('Should validate title is required field if missing', () => {
    //System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      //Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      //Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    })
  })
})
})
