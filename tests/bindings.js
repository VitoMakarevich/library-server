const assert = require('chai').assert;

const { book: bookMethods, author: authorMethods, user: userMethods, binding: bindingMethods } = require('../methods');

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

const testBindingData = [
    {
        userId: 1,
        bookId: 1
    },
    {
        userId: 2,
        bookId: 1
    }
]


describe('Bindings methods', function () {
    this.timeout(5000);

    beforeEach(async () => {
        await authorMethods.deleteAll();
        await bookMethods.deleteAll();
        await userMethods.deleteAll();
        await bindingMethods.deleteAll();

        for (const authorIndex in testAuthorData) {
            await authorMethods.create(testAuthorData[authorIndex]);
        };
        for (const bookIndex in testBookData) {
            await bookMethods.create(testBookData[bookIndex])
        }
        for (const userIndex in testUserData) {
            const dbObj = Object.assign({}, testUserData[userIndex]);
            delete dbObj.usedBooksCount;
            await userMethods.create(dbObj);
        }
        for (const bindingIndex in testBindingData) {
            await bindingMethods.create(testBindingData[bindingIndex]);
        }
    });

    it('Should create binding', async function () {
        const request = {
            userId: 1,
            bookId: 2
        }

        const result = await bindingMethods.create(request);


        assert.property(result, 'createdAt');
        delete result.createdAt;

        assert.property(result, 'id');
        assert.isNumber(result.id);
        delete result.id;

        assert.isNull(result.finishedAt)
        delete result.finishedAt;

        assert.deepEqual(result, request);
    })

    it('Should read all bindings', async function () {
        const request = {};

        let result = await bindingMethods.readAll(request);

        result = result.map((resultItem) => {
            assert.property(resultItem, 'createdAt');
            delete resultItem.createdAt;

            assert.property(resultItem, 'id');
            assert.isNumber(resultItem.id);
            delete resultItem.id;

            assert.isNull(resultItem.finishedAt)
            delete resultItem.finishedAt;

            return resultItem;
        });

        assert.deepEqual(result, testBindingData.reverse());

    });


    it('Should read all bindings with order by createdAt asc', async function () {
        const request = {
            orderField: 'created_at',
            orderDirection: 'ASC'
        };

        let result = await bindingMethods.readAll(request);

        result = result.map((resultItem) => {
            assert.property(resultItem, 'createdAt');
            delete resultItem.createdAt;

            assert.property(resultItem, 'id');
            assert.isNumber(resultItem.id);
            delete resultItem.id;

            assert.isNull(resultItem.finishedAt)
            delete resultItem.finishedAt;


            return resultItem;
        })


        assert.deepEqual(result, testBindingData);

    });

    it('Should finish binding', async () => {
        const request = {
            id: 1
        };

        let result = await bindingMethods.finish(request);

        assert.deepEqual(result, request);
    })

    it('Should finish unexistent binding', async () => {
        const request = {
            id: 99
        };

        let result = await bindingMethods.finish(request);

        assert.deepEqual(result, {});
    })
});