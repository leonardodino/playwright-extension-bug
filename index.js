const { execSync } = require('child_process')
const result = execSync('node test.js', { encoding: 'utf-8' }).trim()

const reproduced = `
==== persistent ====
DOM insertion: true
clock updated: true
==== inconigto ====
DOM insertion: true
clock updated: false
`.trim()

const fixed = `
==== persistent ====
DOM insertion: true
clock updated: true
==== inconigto ====
DOM insertion: true
clock updated: true
`.trim()

console.log(result, '\n')

if (result === reproduced) {
  console.log('=> 🐛 reproduced')
  process.exit(0)
} else if (result === fixed) {
  console.log('=> 🎉 fixed')
  process.exit(2)
} else {
  console.log('=> 🤔 unknown outcome')
  process.exit(1)
}
