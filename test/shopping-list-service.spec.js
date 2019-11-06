const ShoppingListService = require('../src/shopping-list-service')
const knex = require('knex')

describe.only(`Shopping List service object`, () => {
    let db
    let testItems = [
        {
            id: 1,
            name: 'item 1',
            price: '19.19',
            category: 'Lunch',
            checked: false,
            date_added: new Date('2029-01-22T16:28:32.615Z')
        },
        {
            id: 2,
            name: 'item 2',
            price: '19.99',
            category: 'Breakfast',
            checked: false,
            date_added: new Date('2100-05-22T16:28:32.615Z')
        },
        {
            id: 3,
            name: 'item 3',
            price: '1919.99',
            category: 'Snack',
            checked: true,
            date_added: new Date('1919-12-22T16:28:32.615Z')
        }
    ]

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB2_URL
        })
    })

    before(() => db('shopping_list').truncate())

    afterEach(() => db('shopping_list').truncate())

    after(() => db.destroy())

    context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
            return db.into('shopping_list').insert(testItems)
        })
        it(`getAllShoppingItems() resolves all items from 'shopping_list' table`, () => {
            return ShoppingListService.getAllShoppingItems(db)
                .then(actual => {
                    expect(actual).to.eql(testItems)
                })
        })
        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const secondId = 2
            const secondTestItem = testItems[secondId - 1]
            return ShoppingListService.getById(db, secondId)
                .then(actual => {
                    expect(actual).to.eql({
                        id: secondId,
                        name: secondTestItem.name,
                        price: secondTestItem.price,
                        category: secondTestItem.category,
                        checked: secondTestItem.checked,
                        date_added: secondTestItem.date_added
                    })
                })
        })
        it(`updateItem() updates an item from the 'shopping_list' table`, () => {
            const idOfItemToUpdate = 3
            const newItemData = {
                name: 'updated name',
                price: '5.99',
                category: 'Breakfast',
                checked: false,
                date_added: new Date()
            }
            return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                    expect(item).to.eql({
                        id: idOfItemToUpdate,
                        ...newItemData
                    })
                })
        })
        it(`deleteItem() deletes an item by id from 'shopping_list' table`, () => {
            const itemId = 1
            return ShoppingListService.deleteItem(db, itemId)
                .then(() => ShoppingListService.getAllShoppingItems(db))
                .then(allItems => {
                    [
                        {
                            id: 2,
                            name: 'item 2',
                            price: '19.99',
                            category: 'Breakfast',
                            checked: false,
                            date_added: new Date('2100-05-22T16:28:32.615Z')
                        },
                        {
                            id: 3,
                            name: 'item 3',
                            price: '1919.99',
                            category: 'Snack',
                            checked: true,
                            date_added: new Date('1919-12-22T16:28:32.615Z')
                        }
                    ]
                    const expected = testItems.filter(item => item.id !== itemId)
                    expect(allItems).to.eql(expected)
                })
        })
    })

    context(`Given 'shopping_list' has no data`, () => {
        it(`getAllShoppingItems() resolves an empty array`, () => {
            return ShoppingListService.getAllShoppingItems(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
        })
        it(`insertItem() inserts a new item and resolves the new item with an 'id'`, () => {
            const newItem = {
                name: 'tes new item',
                price: '1.99',
                category: 'Lunch',
                checked: false,
                date_added: new Date('2020-01-01T00:00:00.000Z')
            }
            return ShoppingListService.insertItem(db, newItem)
                .then(actual => {
                    expect(actual).to.eql({
                        id: 1,
                        name: newItem.name,
                        price: newItem.price,
                        category: newItem.category,
                        checked: newItem.checked,
                        date_added: newItem.date_added
                    })
                })
        })
    })
})