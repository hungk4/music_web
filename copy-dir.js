const fs = require('fs-extra')

fs.copy('views', 'dist/views')
  .then(() => console.log('success: dist/views'))
  .catch(err => console.error(err))

fs.copy('public', 'dist/public')
  .then(() => console.log('success: dist/public'))
  .catch(err => console.error(err))