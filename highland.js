const jsonStream = require('JSONStream')
const highland = require('highland')
const fs = require('fs')

function dataStream() {
    return fs.createReadStream('./data1gb.json')
        .pipe(jsonStream.parse('*'))
}

set('iterations', 1)
set('concurrency', 2)

suite('Test highland.js', () => {
    bench('Test map', next =>
        highland(dataStream())
            .map(data => data.posts)
            .on('data', () => {
            })
            .on('end', next)
    )

    bench('Test reduce', next =>
        highland(dataStream())
            .map(e => e.accountHistory.map(el => parseInt(el.amount)))
            .reduce(0, (acc, curr) => acc + curr)
            .on('data', () => {
            })
            .on('end', next)
    )

    bench('Test some', next =>
        highland(dataStream())
            .map(data => data.accountHistory)
            .find(el => el.amount === '0.00')
            .on('data', () => {
            })
            .on('end', next)
    )

    // bench('Test something more', next =>
    //     highland(dataStream())
    //         .map(data => ({
    //             friends: data.friends,
    //             tags: data.tags
    //         }))
    //         .filter(data => data.tags.length > 1)
    //         .map(data => data.tags.concat(data.friends))
    //         .map(data => data.length)
    //         .reduce(0, (acc, curr) => acc + curr)
    //         .on('data', () => {
    //         })
    //         .on('end', next)
    // )
})