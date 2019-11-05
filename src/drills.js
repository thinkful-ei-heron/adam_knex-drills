require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB2_URL
});

function getItemsContainText(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}`)
        .then(result => console.log(result))
}

function getItemsPaginate(pageNumber) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(6)
        .offset(6 * (pageNumber - 1))
        .then(result => console.log(result))
}

function getItemsAddedAfterDate(daysAgo) {
    knexInstance
        .select('id', 'name', 'price', 'category', 'date_added', 'checked')
        .from('shopping_list')
        .where('date_added', '>', knexInstance.raw(`now() - '?? days' ::INTERVAL`, daysAgo))
        .then(result => console.log(result))
}

function getTotalCostOfEachCategory() {
    knexInstance
        .select('category')
        .sum('price AS total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => console.log(result))
}

getItemsContainText('pizza')
getItemsPaginate(3)
getItemsAddedAfterDate(20)
getTotalCostOfEachCategory()