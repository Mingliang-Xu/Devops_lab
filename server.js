const express = require('express')
const app = express()
const path = require('path')

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '4f1c0e46c3ce45ecad82935d35989f9d',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

app.use(express.json())

const students = ['Jimmy', 'Timothy', 'Jimothy']

app.get('/', (req, res) => {

    rollbar.warning('someone got on my app today')
    
    res.sendFile(path.join(__dirname, '/index.html'))
    
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   rollbar.info('a user is adding a new name')

   const index = students.findIndex(student => {
       return student === name
   })

   try {
        // bobbios();
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
           res.status(400).send('You must enter a name.')
       } else {
           res.status(400).send('That student already exists.')
       }
   } catch (err) {
        console.log('my bobbios function did not work at all!')
        rollbar.error('my bobbios function did not work')
   }
})

app.delete('/api/students/:index', (req, res) => {

    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)

    rollbar.critical('a user has been deleted a name')
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
