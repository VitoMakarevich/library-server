var assert = require('chai').assert;

const methods = require('../methods').author;

const testData = [
  { firstName: 'someUser1FirstName', lastName: 'someUser1LastName' },
  { firstName: 'someUser2FirstName', lastName: 'someUser2LastName' }
];

describe('Author methods', function() {
  this.timeout(5000);

  beforeEach(async () => {
    await methods.deleteAll();

    await methods.create(testData[0]);
    await methods.create(testData[1]);
  });

  it('Should create author', async function() {
    const request = {
      firstName: 'john',
      lastName: 'doe'
    }

    const result = await methods.create(request);
  
    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    assert.deepEqual(result, request);
  });

  it('Should read all authors', async function() {
    const request = {};

    let result = await methods.readAll(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    });

    const testDataWithBooks = testData.map((data) => {
      data.booksCount = 0;
      return data;
    })

    assert.deepEqual(result, testDataWithBooks);
  });

  it('Should read author with books', async function() {
    const request = {
      id: 1
    };

    const result = await methods.readOne(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    const testItem = Object.assign({}, testData[0]);
    testItem.booksCount = 0;
    testItem.books = [];

    assert.deepEqual(result, testItem);
  });


  it('Should read all authors with order by last name asc', async function() {
    const request = {
      orderField: 'last_name',
      orderDirection: 'ASC' 
    };

    let result = await methods.readAll(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    })

    const sortedTestData = testData
      .sort((element1, element2) => element1.lastName > element2.lastName)
      .map((element) => {
        element.booksCount = 0;
        return element;
      }) 
    
    assert.deepEqual(result, sortedTestData);
  });

  it('Should read authors with right query', async function() {
    const request = {
      firstName: 'someUser1FirstName'
    };

    const result = await methods.readAll(request);

    const resultItem = result[0];
    assert.property(resultItem, 'createdAt');
    delete resultItem.createdAt;

    assert.property(resultItem, 'id');
    assert.isNumber(resultItem.id);
    delete resultItem.id;

    const expected = testData.slice(0, 1);
    expected[0].booksCount = 0;

    assert.deepEqual(result, expected);
  });

  it('Should read authors with wrong query', async function() {
    const request = {
      firstName: 'wrong'
    };

    const result = await methods.readAll(request);

    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should update existing author', async function() {
    const request = {
      id: 2,
      firstName: 'newFirstName'
    };

    const result = await methods.update(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    const testDataItem = testData[1];
    testDataItem.firstName = request.firstName;
    testDataItem.booksCount = 0;

    assert.deepEqual(result, testDataItem);
  });

  it('Should update unexisting author', async function() {
    const request = {
      id: 99,
      firstName: 'newFirstName'
    };
    const EMPTY_UPDATE_ROW = {};

    const result = await methods.update(request);

    assert.deepEqual(result, EMPTY_UPDATE_ROW);
  });

  it('Should delete existing author', async function() {
    const request = {
      id: 2
    };

    const result = await methods.delete(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    const testDataItem = testData[1];
    testDataItem.booksCount = 0;

    assert.deepEqual(result, testDataItem);
  });

  it('Should delete unexisting author', async function() {
    const request = {
      id: 99
    };

    const result = await methods.delete(request);

    assert.deepEqual(result, {});
  });
});