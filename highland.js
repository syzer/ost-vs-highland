const jsonStream = require('JSONStream')
const highland = require('highland')
const fs = require('fs')

const dataStream = () => fs.createReadStream('./data1gb.json', {encoding: 'utf8'})
    .pipe(jsonStream.parse(false))

set('iterations', 1)
set('concurrency', 1)

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

    bench('Test something more', next =>
        highland(dataStream())
            .map(e => ({
                posts: e.posts,
                accountHistory: e.accountHistory
            }))
            .filter(e => e.accountHistory[0].amount > 100)
            .map(e => e.accountHistory.concat(e.posts))
            .map(e => e.length)
            .reduce(0, (acc, curr) => acc + curr)
            .on('data', () => {
            })
            .on('end', next)
    )
})