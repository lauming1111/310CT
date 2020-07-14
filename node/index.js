const fs = require('fs').promises
const csv = require('csvtojson')
const path = require('path')
const _ = require('lodash')
const {parseAsync} = require('json2csv')


const config = {
  input: path.join(__dirname, "input"),
  output: path.join(__dirname, "output"),
  processed: path.join(__dirname, "processed"),
  model: path.join(__dirname, "processed", "currentModel.csv"),
}


const readdir = async (path) => fs.readdir(path)

const mergeJSON = async (model, json) => {
  const massage = json.map(r => {
    r.score = parseFloat(r.score).toFixed(1)
    return r
  })

  for (const jsondata of massage) {
    await model.map(r => {
      if (r.userID === jsondata.userID && r.itemID === jsondata.itemID) {
        r.score = jsondata.score
      }
      return r
    })
    if (model.filter(r => r.userID === jsondata.userID).length === 0) {
      model.push(jsondata)
    } else if (model.filter(r => r.userID === jsondata.userID && r.itemID === jsondata.itemID && r.score === jsondata.score).length === 0) {
      model.push(jsondata)
    }

  }

  return model
}

const main = async () => {
  try {
    const rr = await readdir(config.input)
      .then(r => r.filter(r => r.startsWith('RR')))
    const up = await readdir(config.input)
      .then(r => r.filter(r => r.startsWith('UP')))

    const modelJSON = await csv({
      noheader: true,
      delimiter: ',',
      headers: ["userID", "itemID", "score"]
    })
      .fromFile(config.model)

    // console.log(modelJSON)
    for (const up_csv of up) {
      const csvJSON = await csv({
        noheader: true,
        delimiter: ',',
        headers: ["userID", "itemID", "score"]
      })
        .fromFile(path.join(__dirname, "input", up_csv))


      const newModel = await mergeJSON(modelJSON, csvJSON)
      console.log(newModel)
      const csvData = await parseAsync(newModel, {header: false, quote: ''})
        .then((r) => {
          console.log(r)
          return fs.writeFile(config.model, r)
        })
      // return fs.rename(path.join(config.input, up_csv), path.join(config.processed, up_csv), {recursive: true})
    }


  } catch (e) {
    throw e
  }
}

main()
  .catch(e => {
    console.log(e)
  })
