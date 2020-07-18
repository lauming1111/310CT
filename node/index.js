const fs = require('fs').promises
const csv = require('csvtojson')
const path = require('path')
const _ = require('lodash')
const { parseAsync } = require('json2csv')
const Recommender = require('likely')
const Promise = require("bluebird");

const config = {
  input: path.join(__dirname, "input"),
  output: path.join(__dirname, "output"),
  processed: path.join(__dirname, "processed"),
  model: path.join(__dirname, "processed", "currentModel.csv"),
}

const log = {
  temp: (r) => {
    console.log(`${new Date()} ${r}`)
  },
  info: (r) => {
    console.log(`${new Date()} [info] ${r}`);
  }
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
      .then(r => r.filter(r => r.startsWith('RR') && r.endsWith('.csv')).sort())
    const up = await readdir(config.input)
      .then(r => r.filter(r => r.startsWith('UP') && r.endsWith('csv')).sort())

    if (rr.length > 0 || up.length > 0) {
      log.info('Processing next batch of data')
      log.info(`rr ${rr}`)
      log.info(`up ${up}`)
    }
    const modelJSON = await csv({
      noheader: true,
      delimiter: ',',
      headers: ["userID", "itemID", "score"]
    })
      .fromFile(config.model)

    for (const up_csv of up) {
      log.info('handling user perfer')
      const csvJSON = await csv({
        noheader: true,
        delimiter: ',',
        headers: ["userID", "itemID", "score"]
      })
        .fromFile(path.join(__dirname, "input", up_csv))


      const newModel = await mergeJSON(modelJSON, csvJSON)
      const csvData = await parseAsync(newModel, { header: false, quote: '' })
        .then((r) => {
          log.temp(`${up_csv}\nnew model:\n${r}`)
          return fs.writeFile(config.model, r)
        })


      await fs.rename(path.join(config.input, up_csv), path.join(config.processed, up_csv), { recursive: true })
        .then(() => log.info('End of handling.'))
    }

    const newModelJSON = await csv({
      noheader: true,
      delimiter: ',',
      headers: ["userID", "itemID", "score"]
    })
      .fromFile(config.model)

    for (const rr_csv of rr) {
      log.info('handling user request')

      const requests = await csv({
        noheader: true,
        delimiter: ',',
        headers: ["userID"]
      })
        .fromFile(path.join(__dirname, "input", rr_csv))

      for (const request of requests) {
        var rowLabels = [...new Set(newModelJSON.map(r => r.userID))].sort()
        var colLabels = [...new Set(newModelJSON.map(r => r.itemID))].sort()
        var matrix = Array(rowLabels.length).fill().map(() => Array(colLabels.length).fill(0))

        // transform json to json matrix
        rowLabels.forEach((r, rindex) => {
          colLabels.forEach((rrrr, rrrrrindex) => {
            newModelJSON.filter(rr => rr.userID === r && rr.itemID === rrrr)
              .forEach((rr, rrindex) => {
                matrix[rindex][rrrrrindex] = rr.score
              })
          })
        })

        log.temp(`\nmatrix:\n${JSON.stringify(matrix)}`)

        var Model = Recommender.buildModel(matrix, rowLabels, colLabels)
        var recommendations = Model.rankAllItems(request.userID)

        log.temp(`\nmatrix:\n${JSON.stringify(matrix)}`)
        log.temp(`\nrecommendations:\n${JSON.stringify(recommendations)}`)

        const getSecondRank = recommendations.sort(([item, rank], [item2, rank2]) => {
          return rank2 - rank
        })[1]
        log.temp(`\nRank:${getSecondRank[1]}\nItem:${getSecondRank[0]}`)


        await parseAsync([{ item: request.userID, rank: getSecondRank[0] }], { header: false, quote: '' })
          .then((r) => {
            return fs.writeFile(path.join(config.output, rr_csv), r)
          })
          .then(() => {
            return fs.rename(path.join(config.input, rr_csv), path.join(config.processed, rr_csv), { recursive: true })
              .then(() => log.info('End of handling.'))
          })
      }
    }

  } catch (e) {
    throw e
  }

  await Promise.delay(1000)
  await main()
}

main()
  .then(async () => {

  })
  .catch(e => {
    main()
    console.error(e)
  })
