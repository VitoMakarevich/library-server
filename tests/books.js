var assert = require('chai').assert;

const methods = require('../methods').book;
const { book, author } = require ('../models');
const sequelize = require('../models').sequelize;

const testBookData = [
  { 
    name: 'bookName1',
    description: 'bookDesc1',
    usesCount: 1,
    author: 1
  },
  { 
    name: 'bookName2',
    description: 'bookDesc2',
    usesCount: 0,
    author: 2
  }
];



const testAuthorData = [
    { firstName: 'someUser1FirstName', lastName: 'someUser1LastName' },
    { firstName: 'someUser2FirstName', lastName: 'someUser2LastName' }
];

const mappedAndSortedTestData = testBookData
.map((bookData) => {
  bookData.author = testAuthorData[bookData.author - 1];
  return bookData;
})
.sort((bookData1, bookData2) => bookData1.name < bookData2.name);

describe('Book methods', function() {
  this.timeout(5000);


  beforeEach(async () => {
    await author.destroy({
        truncate: true,
        restartIdentity: true,
        cascade: true
    });

    await book.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true
    })

    const promiseArray = mappedAndSortedTestData.map((dataElement) => {
      return book.create(
        dataElement,
        {
          include: [{
            association: book.author
          }]
        }
      )
    });
    await promiseArray[0];
    await promiseArray[1];
  });

  it('Should create book', async function() {
    const request = {
      name: '1234',
      description: '2345',
      author: 1
    }
    
    const result = await methods.create(request);

    const expected = {
      name: request.name,
      description: request.description,
      author: mappedAndSortedTestData[request.author - 1].author,
      usesCount: 0
    }

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    assert.property(result.author, 'id');
    assert.isNumber(result.author.id);
    delete result.author.id;

    assert.property(result, 'author');
    assert.isObject(result.author);
    assert.property(result.author, 'createdAt');
    delete result.author.createdAt;

    assert.deepEqual(result, expected);
  })

  it('Should read all books', async function() {
    const request = {};

    let result = await methods.read(request); 

    result = result.map((item) => {
      assert.property(item, 'createdAt');
      delete item.createdAt;
  
      assert.property(item, 'id');
      assert.isNumber(item.id);
      delete item.id;
  
      assert.property(item.author, 'id');
      assert.isNumber(item.author.id);
      delete item.author.id;
  
      assert.property(item, 'author');
      assert.isObject(item.author);
      assert.property(item.author, 'createdAt');
      delete item.author.createdAt;

      return item;
    })

    assert.deepEqual(result, mappedAndSortedTestData);

  });


  it('Should read all books with order by name asc', async function() {
    const request = {
      orderField: 'name',
      orderDirection: 'ASC' 
    };

    const sortedTestData = mappedAndSortedTestData.sort((item1, item2) => item1.name > item2.name);

    let result = await methods.read(request);

    result = result.map((item) => {
      assert.property(item, 'createdAt');
      delete item.createdAt;
  
      assert.property(item, 'id');
      assert.isNumber(item.id);
      delete item.id;
  
      assert.property(item.author, 'id');
      assert.isNumber(item.author.id);
      delete item.author.id;
  
      assert.property(item, 'author');
      assert.isObject(item.author);
      assert.property(item.author, 'createdAt');
      delete item.author.createdAt;

      return item;
    })

    assert.deepEqual(result, sortedTestData);
    
  });

  it('Should read books with right query', async function() {
    const request = {
      name: mappedAndSortedTestData[0].name
    };

    let result = await methods.read(request);

    result = result.map((item) => {
      assert.property(item, 'createdAt');
      delete item.createdAt;
  
      assert.property(item, 'id');
      assert.isNumber(item.id);
      delete item.id;
  
      assert.property(item.author, 'id');
      assert.isNumber(item.author.id);
      delete item.author.id;
  
      assert.property(item, 'author');
      assert.isObject(item.author);
      assert.property(item.author, 'createdAt');
      delete item.author.createdAt;

      return item;
    })

    assert.lengthOf(result, 1);
    assert.deepEqual(result, mappedAndSortedTestData.slice(0, 1));
  });

  it('Should read authors with wrong query', async function() {
    const request = {
      name: 'wrong'
    };

    const result = await methods.read(request);

    assert.isArray(result);
    assert.lengthOf(result, 0);
  });

  it('Should update existing book', async function() {
    const request = {
      id: 2,
      name: 'newName'
    };

    const result = await methods.update(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;
    
    assert.property(result.author, 'id');
    assert.isNumber(result.author.id);
    delete result.author.id;
    
    assert.property(result, 'author');
    assert.isObject(result.author);
    assert.property(result.author, 'createdAt');
    delete result.author.createdAt;

    const testDataItem = mappedAndSortedTestData[1];

    testDataItem.name = request.name;

    assert.deepEqual(result, testDataItem);

  });

  it('Should update unexisting book', async function() {
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