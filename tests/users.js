const assert = require('chai').assert;

const { book: bookMethods, author: authorMethods, user: userMethods } = require('../methods');

const testUserData = [
  { 
    firstName: 'someUser1FirstName', 
    lastName: 'someUser1LastName',
    email: 'someEmail1@mail.com',
    passportNumber: 'passport1',
    usedBooksCount: 0
  },
  {
    firstName: 'someUser2FirstName', 
    lastName: 'someUser2LastName',
    email: 'someEmail2@mail.com',
    passportNumber: 'passport2',
    usedBooksCount: 0
  }
];

const testBookData = [
  { 
    name: 'bookName1',
    description: 'bookDesc1',
    usesCount: 0,
    authorId: 1
  },
  { 
    name: 'bookName2',
    description: 'bookDesc2',
    usesCount: 0,
    authorId: 2
  }
];

const testAuthorData = [
  { firstName: 'someUser1FirstName', lastName: 'someUser1LastName' },
  { firstName: 'someUser2FirstName', lastName: 'someUser2LastName' }
];


describe('User methods', function() {
  this.timeout(5000);

  beforeEach(async () => {
    await authorMethods.deleteAll();
    await bookMethods.deleteAll();
    await userMethods.deleteAll();

    for(const authorIndex in testAuthorData) {
      await authorMethods.create(testAuthorData[authorIndex]);
    };
    for(const bookIndex in testBookData) {
      await bookMethods.create(testBookData[bookIndex])
    }
    for(const userIndex in testUserData) {
      const dbObj = Object.assign({}, testUserData[userIndex]);
      delete dbObj.usedBooksCount;
      await userMethods.create(dbObj);
    }
  });

  it('Should create user', async function() {
    const request = {
      firstName: 'john',
      lastName: 'doe',
      email: 'email@mail.com',
      passportNumber: '12345'
    }

    const result = await userMethods.create(request);

  
    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    request.usedBooksCount = 0;

    assert.deepEqual(result, request);
  })

  it('Should read all users', async function() {
    const request = {};

    let result = await userMethods.read(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    });

    const sortedTestData = testUserData.sort((element1, element2) => element1.firstName < element2.firstName ) 

    assert.deepEqual(result, sortedTestData);

  });


  it('Should read all users with order by last name asc', async function() {
    const request = {
      orderField: 'last_name',
      orderDirection: 'ASC' 
    };

    let result = await userMethods.read(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    })

    const sortedTestData = testUserData.sort((element1, element2) => element1.lastName > element2.lastName ) 
    
    assert.deepEqual(result, sortedTestData);
    
  });

  it('Should read users with right query', async function() {
    const request = {
      firstName: 'someUser1FirstName'
    };

    const result = await userMethods.read(request);

    const resultItem = result[0];
    assert.property(resultItem, 'createdAt');
    delete resultItem.createdAt;

    assert.property(resultItem, 'id');
    assert.isNumber(resultItem.id);
    delete resultItem.id;

    assert.deepEqual(result, testUserData.slice(0, 1));
  });

  it('Should read authors with wrong query', async function() {
    const request = {
      firstName: 'wrong'
    };

    const result = await userMethods.read(request);

    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should update existing user', async function() {
    const request = {
      id: 2,
      firstName: 'newFirstName'
    };

    const result = await userMethods.update(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    const testDataItem = testUserData[1];

    testDataItem.firstName = request.firstName;

    assert.deepEqual(result, testDataItem);

  });

  it('Should update unexisting user', async function() {
    const request = {
      id: 99,
      firstName: 'newFirstName'
    };

    const EMPTY_UPDATE_ROW = {};

    const result = await userMethods.update(request);

    assert.deepEqual(result, EMPTY_UPDATE_ROW);

  });

  it('Should delete existing user', async function() {
    const request = {
      id: 2
    };

    const result = await userMethods.delete(request);

    assert.deepEqual(result, request);

  });

  it('Should delete unexisting user', async function() {
    const request = {
      id: 99
    };

    const DELETED_ROWS_RIGHT_COUNT = 0;

    const result = await userMethods.delete(request);

    assert.deepEqual(result, {});

  });

});