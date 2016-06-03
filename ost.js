const jsonStream = require('JSONStream')
const ost = require('object-stream-tools')
const fs = require('fs')

function dataStream() {
    return fs.createReadStream('./data1gb.json')
        .pipe(jsonStream.parse('*'))
}

set('iterations', 1)
set('concurrency', 2)

suite('Test ost.js', () => {
    bench('Test map', next => {
        dataStream()
            .pipe(ost.map(data => data.posts))
            .on('data', () => {
            })
            .on('end', next)
    })

    bench('Test reduce', next =>
        dataStream()
            .pipe(ost.map(e => e.accountHistory.map(el => parseInt(el.amount))))
            .pipe(ost.reduce((acc, curr) => acc + curr, 0))
            .on('data', () => {
            })
            .on('end', next)
    )

    bench('Test some', next =>
        dataStream()
            .pipe(ost.map(data => data.accountHistory))
            .pipe(ost.find(el => el.amount === '0.00'))
            .on('data', () => {
            })
            .on('end', next)
    )

    // bench('Test something more', next =>
    //     dataStream()
    //         .pipe(ost.map(data => ({
    //             friends: data.friends,
    //             tags: data.tags
    //         })))
    //         .pipe(ost.filter(data => data.tags.length > 1))
    //         .pipe(ost.map(data => data.tags.concat(data.friends)))
    //         .pipe(ost.map(data => data.length))
    //         .pipe(ost.reduce((acc, curr) => acc + curr, 0))
    //         .on('data', () => {
    //         })
    //         .on('end', next)
    // )
})