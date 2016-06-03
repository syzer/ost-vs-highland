const jsonStream = require('JSONStream')
const ost = require('object-stream-tools')
const fs = require('fs')

function dataStream() {
    return fs.createReadStream('./data.json')
        .pipe(jsonStream.parse('*'))
}

set('iterations', 10)
set('concurrency', 2)

suite('Test ost.js', () => {
    bench('Test map', next => {
        dataStream()
            .pipe(ost.map(data => data.friends))
            .on('data', () => {})
            .on('end', next);
    })

    bench('Test reduce', next =>
        dataStream()
        .pipe(ost.reduce((acc, curr) => acc + curr, 0))
        .on('data', () => {})
        .on('end', next)
    )

    bench('Test some', next =>
        dataStream()
        .pipe(ost.map(data => data.age))
        .pipe(ost.some(age => age === 45))
        .on('data', () => {})
        .on('end', next)
    )

    bench('Test something more', next =>
        dataStream()
        .pipe(ost.map(data => ({
            friends: data.friends,
            tags: data.tags
        })))
        .pipe(ost.filter(data => data.tags.length > 1))
        .pipe(ost.map(data => data.tags.concat(data.friends)))
        .pipe(ost.map(data => data.length))
        .pipe(ost.reduce((acc, curr) => acc + curr, 0))
        .on('data', () => {})
        .on('end', next)
    )
})