const jsonStream = require('JSONStream')
const highland = require('highland')
const fs = require('fs')

function dataStream() {
    return fs.createReadStream('./data.json')
        .pipe(jsonStream.parse('*'))
}

set('iterations', 10)
set('concurrency', 2)

suite('Test highland.js', () => {
    bench('Test map', next =>
        highland(dataStream())
        .map(data => data.friends)
        .on('data', () => {})
        .on('end', next)
    )

    bench('Test reduce', next =>
        highland(dataStream())
        .reduce(0, (acc, curr) => acc + curr)
        .on('data', () => {})
        .on('end', next)
    )

    bench('Test some', next =>
        highland(dataStream())
        .map(data => data.age)
        .find(age => age === 45)
        .on('data', () => {})
        .on('end', next)
    )

    bench('Test something more', next =>
        highland(dataStream())
        .map(data => ({
            friends: data.friends,
            tags: data.tags
        }))
        .filter(data => data.tags.length > 1)
        .map(data => data.tags.concat(data.friends))
        .map(data => data.length)
        .reduce(0, (acc, curr) => acc + curr)
        .on('data', () => {})
        .on('end', next)
    )
})