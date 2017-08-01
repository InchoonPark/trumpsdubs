const async = require('async')
const fs = require('fs')
const restify = require('restify')
const shortid = require('shortid')
const Dub = require('../models/dub')

let wordList = []

const getObjects = (nextMarker) => {
  const params = {
    Bucket: 'trumpsdubs-words',
    Delimiter: '/',
    Marker: nextMarker
  }

  s3.listObjects(params, (error, result) => {
    if(error) {
      console.log(error)
    } else {
      const words = result.Contents.map(file => {
        return file.Key.slice(0, -4)
      })

      wordList = [...wordList, ...words]

      if(result.NextMarker) {
        getObjects(result.NextMarker)
      }
    }
  })
}

getObjects()

server.post('/dubs', (req, res, next) => {
  const body = JSON.parse(req.body) || {}
  const { text } = body

  if(!text) {
    return next(new restify.BadRequestError('Please enter a word or phrase.'))
  }

  const words = text.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'').replace(/\s{2,}/g,' ').toLowerCase().split(' ')
  const dubId = shortid.generate()
  const dubFilePath = `./tmp/${dubId}.mp3`
  const dubFile = fs.createWriteStream(dubFilePath)

  async.eachSeries(words, (word, callback) => {
    if(wordList.includes(word)) {
      const s3FileParams = {
        Bucket: 'trumpsdubs-words',
        Key: `${word}.mp3`
      }

      const stream = s3.getObject(s3FileParams).createReadStream()
      stream.pipe(dubFile, {end: false})

      stream.on('end', () => {
        return callback()
      })
    } else {
      return callback(`The word ${word} is not in Donnie's vocabulary! Please try something else.`)
    }
  }, (error) => {
    dubFile.end()

    if(error) {
      return next(new restify.NotImplementedError(error))
    }

    const dubFileStream = fs.createReadStream(dubFilePath)

    s3.putObject({
      Bucket: process.env.AWS_BUCKET,
      Key: `${dubId}.mp3`,
      Body: dubFileStream
    }, (error, result) => {
      fs.unlinkSync(dubFilePath)
      
      if(error) {
        return next(new restify.InternalServerError('Sorry, something went wrong. Please try again!'))
      }

      Dub.create({ _id: dubId, text: text.trim() }, (error, dub) => {
        if(error) {
          return next(new restify.InternalServerError('Sorry, something went wrong. Please try again!'))
        }
        return res.send(200, dub)
      })
    })
  })
})

server.get('/dubs/:id', (req, res, next) => {
  const params = req.params || {}
  const { id } = params

  Dub.findOne({ _id: id }, (error, dub) => {
    if(error) {
      return next(new restify.InternalServerError('Sorry, something went wrong. Please try again!'))
    }
    if(!dub) {
      return next(new restify.NotFoundError('Dub not found!'))
    }
    res.send(200, dub)
    return next()
  })
})
