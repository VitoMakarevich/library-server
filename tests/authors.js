var assert = require('chai').assert;

const methods = require('../methods').author;
const author = require ('../models').author;

console.log(author)

describe('Author methods', function() {
  this.timeout(5000);

  beforeEach(async () => {
    await(
      author.destroy({
        truncate: true
      })
    );
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
});