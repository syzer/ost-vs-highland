const fs = require('fs')
const faker = require('faker')
const _ = require('lodash')
const size = 100000
const fileName = './data1gb.json'
const file = fs.createWriteStream(fileName)

_.times(size, () => {
    file.write(JSON.stringify(faker.helpers.createCard()) + '\n')
    file.write(JSON.stringify(faker.helpers.createCard()) + '\n')
    file.write(JSON.stringify(faker.helpers.createCard()) + '\n')
    file.write(JSON.stringify(faker.helpers.createCard()) + '\n')
    file.write(JSON.stringify(faker.helpers.createCard()) + '\n')
})

file.end()
console.log(fileName + ' generated')
