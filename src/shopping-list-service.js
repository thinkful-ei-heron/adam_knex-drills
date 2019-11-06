const ShoppingListService = {
    getAllShoppingItems(knex) {
        return knex.select('*').from('shopping_list')
    },
    getById(knex, id) {
        return knex.from('shopping_list').select('*').where('id', id).first()
    },
    insertItem(knex, newItem) {
        return knex.insert(newItem).into('shopping_list').returning('*').then(rows => rows[0])
    },
    updateItem(knex, id, newData) {
        return knex('shopping_list').where({ id }).update(newData)
    },
    deleteItem(knex, id) {
        return knex('shopping_list').where({ id }).delete()
    }
}   


module.exports = ShoppingListService