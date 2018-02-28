const assert = require('chai').assert;

const { book: bookMethods, author: authorMethods } = require('../methods');

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

const mappedAndSortedTestData = testBookData
.map((bookData) => {
  const mappedBookWithAuthor = Object.assign({}, bookData)
  mappedBookWithAuthor.author = testAuthorData[bookData.authorId - 1];
  return mappedBookWithAuthor;
})
.sort((bookData1, bookData2) => bookData1.name < bookData2.name);

describe('Book methods', function() {
  this.timeout(5000);


  beforeEach(async () => {
    await authorMethods.deleteAll();
    await bookMethods.deleteAll();
    for(const authorIndex in testAuthorData) {
      await authorMethods.create(testAuthorData[authorIndex]);
    };
    
    for(const bookIndex in testBookData) {
      await bookMethods.create(testBookData[bookIndex])
    }
  });

  it('Should create book', async function() {
    const request = {
      name: '1234',
      description: '2345',
      authorId: 1
    }
    
    const result = await bookMethods.create(request);

    const expected = {
      name: request.name,
      description: request.description,
      authorId: request.authorId,
      usesCount: 0
    };

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;

    assert.deepEqual(result, expected);
  })

  it('Should read all books', async function() {
    const request = {};

    let result = await bookMethods.readAll(request); 

    assert.equal(result.numItems, mappedAndSortedTestData.length);
    result = result.books.map((item) => {
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

    let result = await bookMethods.readAll(request);

    assert.equal(result.numItems, mappedAndSortedTestData.length)

    result = result.books.map((item) => {
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

    let result = await bookMethods.readAll(request);
    assert.equal(result.numItems, 1);

    result = result.books.map((item) => {
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

    const result = await bookMethods.readAll(request);

    assert.equal(result.numItems, 0)
    assert.isArray(result.books);
    assert.lengthOf(result.books, 0);
  });

  it('Should update existing book', async function() {
    const request = {
      id: 2,
      name: 'newName'
    };

    const result = await bookMethods.update(request);

    assert.property(result, 'createdAt');
    delete result.createdAt;

    assert.property(result, 'id');
    assert.isNumber(result.id);
    delete result.id;
    
    assert.property(result, 'authorId');

    const testDataItem = testBookData[1];

    testDataItem.name = request.name;

    assert.deepEqual(result, testDataItem);

  });

  it('Should update unexisting book', async function() {
    const request = {
      id: 99,
      firstName: 'newFirstName'
    };

    const EMPTY_UPDATE_ROW = {};

    const result = await bookMethods.update(request);

    assert.deepEqual(result, EMPTY_UPDATE_ROW);

  });

  it('Should delete existing user', async function() {
    const request = {
      id: 2
    };

    const result = await bookMethods.delete(request);

    assert.deepEqual(result, request);

  });

  it('Should delete unexisting user', async function() {
    const request = {
      id: 99
    };

    const DELETED_ROWS_RIGHT_COUNT = 0;

    const result = await bookMethods.delete(request);

    assert.deepEqual(result, {});

  });

});