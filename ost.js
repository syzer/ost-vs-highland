const jsonStream = require('JSONStream')
const ost = require('object-stream-tools')
const fs = require('fs')

const dataStream = () => fs.createReadStream('./data1gb.json', {encoding: 'utf8'})
    .pipe(jsonStream.parse(false))

set('iterations', 2)
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

    bench('Test something more', next =>
        dataStream()
            .pipe(ost.map(e => ({
                posts: e.posts,
                accountHistory: e.accountHistory
            })))
            .pipe(ost.filter(e => e.accountHistory[0].amount > 100))
            .pipe(ost.map(e => e.accountHistory.concat(e.posts)))
            .pipe(ost.map(e => e.length))
            .pipe(ost.reduce((acc, curr) => acc + curr, 0))
            .on('data', () => {
            })
            .on('end', next)
    )
})