var assert = require('chai').assert;

const methods = require('../methods').book;
const { book, author } = require ('../models');
const sequelize = require('../models').sequelize;

const testBookData = [
  { 
    name: 'bookName1',
    description: 'bookDesc1',
    author: 1
  },
  { 
    name: 'bookName2',
    description: 'bookDesc2',
    author: 2
  }
];

const testAuthorData = [
    { firstName: 'someUser1FirstName', lastName: 'someUser1LastName' },
    { firstName: 'someUser2FirstName', lastName: 'someUser2LastName' }
];


describe('Book methods', function() {
  this.timeout(5000);


  beforeEach(async () => {
    await(
      author.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
      })
    );

    await(book.create({
        name: 'sadasd',
        description: '231r5',
        author: {
          firstName: "2321",
          lastName: 'ew1w1e1'
        }
      }, {
        include: [{
          association: book.author
        }]
      }
    ));


    
    
  });

  it.only('Should create book', async function() {
    const request = {
      name: '2345',
      description: '3456',
      author: 1
    }
    
    const result = await methods.create(request);

  
    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    assert.deepEqual(result, request);
  })

  it('Should read all users', async function() {
    const request = {};

    let result = await methods.read(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    });

    const sortedTestData = testData.sort((element1, element2) => element1.firstName < element2.firstName ) 

    assert.deepEqual(result, sortedTestData);

  });


  it('Should read all users with order by last name asc', async function() {
    const request = {
      orderField: 'last_name',
      orderDirection: 'ASC' 
    };

    let result = await methods.read(request);

    result = result.map((resultItem) => {
      assert.property(resultItem, 'createdAt');
      delete resultItem.createdAt;
  
      assert.property(resultItem, 'id');
      assert.isNumber(resultItem.id);
      delete resultItem.id;

      return resultItem;
    })

    const sortedTestData = testData.sort((element1, element2) => element1.lastName > element2.lastName ) 
    
    assert.deepEqual(result, sortedTestData);
    
  });

  it('Should read users with right query', async function() {
    const request = {
      firstName: 'someUser1FirstName'
    };

    const result = await methods.read(request);

    const resultItem = result[0];
    assert.property(resultItem, 'createdAt');
    delete resultItem.createdAt;

    assert.property(resultItem, 'id');
    assert.isNumber(resultItem.id);
    delete resultItem.id;

    assert.deepEqual(result, testData.slice(0, 1));
  });

  it('Should read authors with wrong query', async function() {
    const request = {
      firstName: 'wrong'
    };

    const result = await methods.read(request);

    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should update existing user', async function() {
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

    assert.deepEqual(result, testDataItem);

  });

  it('Should update unexisting user', async function() {
    const request = {
      id: 99,
      firstName: 'newFirstName'
    };

    const EMPTY_UPDATE_ROW = {};

    const result = await methods.update(request);

    assert.deepEqual(result, EMPTY_UPDATE_ROW);

  });

  it('Should delete existing user', async function() {
    const request = {
      id: 2
    };

    const DELETED_ROWS_RIGHT_COUNT = 1;

    const result = await methods.delete(request);

    assert.deepEqual(result, DELETED_ROWS_RIGHT_COUNT);

  });

  it('Should delete unexisting user', async function() {
    const request = {
      id: 99
    };

    const DELETED_ROWS_RIGHT_COUNT = 0;

    const result = await methods.delete(request);

    assert.deepEqual(result, DELETED_ROWS_RIGHT_COUNT);

  });

});