var assert = require('chai').assert;

const methods = require('../methods').author;
const author = require ('../models').author;
const sequelize = require('../models').sequelize;

const testData = [
  { firstName: 'someUser1FirstName', lastName: 'someUser1LastName' },
  { firstName: 'someUser2FirstName', lastName: 'someUser2LastName' }
];

console.log(author)

describe('Author methods', function() {
  this.timeout(5000);

  beforeEach(async () => {
    await(
      author.destroy({
        truncate: true,
        restartIdentity: true
      })
    );
    await(author.bulkCreate(testData));
    
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
  })

  it('Should read authors with right query', async function() {
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

    const DELETED_ROWS_RIGHT_COUNT = 1;

    const result = await methods.delete(request);

    assert.deepEqual(result, DELETED_ROWS_RIGHT_COUNT);

  });

  it('Should delete unexisting author', async function() {
    const request = {
      id: 99
    };

    const DELETED_ROWS_RIGHT_COUNT = 0;

    const result = await methods.delete(request);

    assert.deepEqual(result, DELETED_ROWS_RIGHT_COUNT);

  });

});