//Importing requires libraries
require("dotenv").config();
const Spotify = require('node-spotify-api');
const axios = require('axios')
const fs = require('fs')
const moment = require('moment')
const keys = require("./keys.js")

//accessing stored keys
let spotify = new Spotify(keys.spotify);

const [, , command, ...choice] = process.argv

//joinChoice takes the choice element in our process.argv and converts it to a string using join.
let joinChoice = choice.join(' ')

//concert-this function
//note: all commands use fs.appendFile to track our output to the log.txt file
const findConcert = (band) => {
  if (joinChoice) {
    axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`)
      .then(({ data }) => {
        if (Array.isArray(data)) {
          console.log(data.length === 0 ? 'There are no scheduled concerts.' : 'Here are the concerts below.')
          fs.appendFile('log.txt', data.length === 0 ? 'There are no scheduled concerts. \r\n' : 'Here are the concerts below. \r\n', e => e ? console.log(e) : null)
          data.forEach(concert => {
            const {
              venue: { name },
              venue: { city },
              datetime
            } = concert
            let date = moment(datetime).format("MM/DD/YYYY")
            fs.appendFile('log.txt', `******************************* \r\n******************************* \r\n${name} \r\n${city} \r\n${date} \r\n`, e => e ? console.log(e) : null)
            console.log('*******************************'),
            console.log('*******************************'),
            console.log(name),
            console.log(city),
            console.log(date)
          })
        } else {
          console.log("Could not find artist")
          fs.appendFile('log.txt', `Could not find artist \r\n`, e => e ? console.log(e) : null)

        }
      }

      )
      .catch(e => console.log(e))
  }
  else {
    console.log("Please enter an Artist.")
  }
}

//spotify-this-song function
//note: all commands use fs.appendFile to track our output to the log.txt file
const searchSong = (song) => {
  song ? song : song = "The Sign"
  spotify
    .search({ type: 'track', query: song })
    .then(({ tracks: { items } }) => {

      items.forEach(song => {
        const {
          artists,
          name: songName,
          preview_url,
          album: {
            name: albumName
          }
        } = song

        artists.forEach(artist => {

          if (!joinChoice && artist.name === 'Ace of Base' && songName === 'The Sign') {
            fs.appendFile('log.txt', `********BEGIN SONG INFO************\r\n***********************************\r\n${artist.name}\r\n${songName}\r\n${preview_url}\r\n ${albumName}\r\n **********END SONG INFO************\r\n***********************************\r\n`, e => e ? console.log(e) : null)

            console.log('********BEGIN SONG INFO************')
            console.log('***********************************')
            console.log(artist.name)
            console.log(songName)
            console.log(preview_url || "Preview not available.")
            console.log(albumName)
            console.log('**********END SONG INFO************')
            console.log('***********************************')
          } else if (joinChoice || command === "do-what-it-says") {
            fs.appendFile('log.txt', `********BEGIN SONG INFO************\r\n***********************************\r\n${artist.name}\r\n${songName}\r\n${preview_url}\r\n${albumName}\r\n**********END SONG INFO************\r\n***********************************\r\n`, e => e ? console.log(e) : null)
            console.log('********BEGIN SONG INFO************')
            console.log('***********************************')
            console.log(artist.name)
            console.log(songName)
            console.log(preview_url || "Preview not available.")
            console.log(albumName)
            console.log('**********END SONG INFO************')
            console.log('***********************************')
          }

        })
      })
    })
    .catch(function (err) {
      console.log(err);
    });
}

//movie-this function
//note: all commands use fs.appendFile to track our output to the log.txt file
const findMovie = (movie) => {
  movie ? movie : movie = "Mr. Nobody"
  axios.get(`http://www.omdbapi.com/?t=${movie}&apikey=trilogy`)
    .then(({ data }) => {
      if (data.Response === 'True') {
        const {
          Title,
          Year,
          Ratings,
          Country,
          Language,
          Plot,
          Actors
        } = data

        console.log('**********BEGIN MOVIE INFO************')
        console.log('**************************************')
        console.log(Title)
        console.log(Year)
        console.log(Country)
        console.log(Language)
        console.log(Plot)
        console.log(Actors)
        fs.appendFile('log.txt', `**********BEGIN MOVIE INFO************\r\n**************************************\r\n${Title}\r\n${Year}\r\n${Country}\r\n${Language}\r\n${Plot}\r\n${Actors}\r\n`, e => e ? console.log(e) : null)
        Ratings.forEach(rating => {
          if (rating.Source === 'Internet Movie Database' || rating.Source === 'Rotten Tomatoes') {
            console.log(`${rating.Source}: ${rating.Value}`)
            fs.appendFile('log.txt', `${rating.Source}: ${rating.Value}\r\n`, e => e ? console.log(e) : null)

          }
        })

        console.log('************END MOVIE INFO************')
        console.log('**************************************')
        fs.appendFile('log.txt', `************END MOVIE INFO************\r\n**************************************\r\n`, e => e ? console.log(e) : null)

      } else {
        console.log(data.Error)
      }
    })

    .catch(e => console.log(e))
}

//do-what-it-says function. This figures which of the above functions to run
const checkCommand = (str) => {
  let strArr = str.split(',')
  let command = strArr[0]
  let searchTerm = strArr[1].replace(/["]+/g, '')

  if (command === 'spotify-this-song') {
    searchSong(searchTerm)
  } else if (command === 'movie-this') {
    findMovie(searchTerm)
  } else if (command === 'concert-this') {
    findConcert(searchTerm)
  }
}
//once we figure out what function to run, this command runs the do-what-it-says function
const runTextCommand = () => {
  fs.readFile('random.txt', 'utf8', (e, data) => (e ? console.log(e) : checkCommand(data)))
}

//recording command into log file
const logCommands = () => {
  if (joinChoice && command) {
    fs.appendFile('log.txt', `${command}, ${joinChoice}:\r\n`, e => e ? console.log(e) : null)
    fs.appendFile('log.txt', `Output:\r\n`, e => e ? console.log(e) : null)
  } else if (!joinChoice && command) {
    fs.appendFile('log.txt', `${command}, NO CHOICE COMMAND GIVEN:\r\n`, e => e ? console.log(e) : null)
    fs.appendFile('log.txt', `Output:\r\n`, e => e ? console.log(e) : null)
  } else {
    fs.appendFile('log.txt', `No Commands Provided:\r\n`, e => e ? console.log(e) : null)
    fs.appendFile('log.txt', `Output:\r\n`, e => e ? console.log(e) : null)
  }
}

//switch cases that take the arguments we enter in the terminal and processes them to run the appropriate functions
switch (command) {
  case "concert-this":
    logCommands()
    findConcert(joinChoice)

    break

  case "spotify-this-song":
    logCommands()
    searchSong(joinChoice)

    break

  case "movie-this":
    logCommands()
    findMovie(joinChoice)

    break

  case "do-what-it-says":
    logCommands()
    runTextCommand()

    break

  default:
    logCommands()
    fs.appendFile('log.txt', `Invalid Arguments \r\n \r\n`, e => e ? console.log(e) : null)
    console.log('Invalid Arguments')
    break
}

