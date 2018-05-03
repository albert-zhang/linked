/**
 * Created by yangzhang on 23/09/2016.
 */

var passedParams = [] // format: [{key: '', value: ''}]

process.argv.forEach(function(v, i) {
    if (i >= 2) {
        var pair = v.split('=')
        if (pair.length === 2) {
            var param = {key: pair[0], value: pair[1]}
            passedParams.push(param)
        }
    }
})

console.log('\n')
passedParams.forEach(function(v) {
    console.log('Param: ' + v.key + ' = ' + v.value + '\n')
})
console.log('\n')

module.exports = passedParams
