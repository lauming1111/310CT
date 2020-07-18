var Recommender = require('likely')
// const Recommend = require('collaborative-filter')

var myData = [
  {userID: '1', itemID: '101', score: '5.0'},
  {userID: '1', itemID: '102', score: '3.0'},
  {userID: '1', itemID: '103', score: '2.5'},
  {userID: '2', itemID: '101', score: '2.0'},
  {userID: '2', itemID: '102', score: '2.0'},
  {userID: '2', itemID: '103', score: '5.0'},
  {userID: '2', itemID: '104', score: '2.0'},
  {userID: '3', itemID: '101', score: '2.5'},
  {userID: '3', itemID: '104', score: '4.0'},
  {userID: '3', itemID: '105', score: '4.5'},
  {userID: '3', itemID: '107', score: '5.0'},
  {userID: '4', itemID: '101', score: '5.0'},
  {userID: '4', itemID: '103', score: '3.0'},
  {userID: '4', itemID: '104', score: '4.5'},
  {userID: '4', itemID: '106', score: '4.0'},
  {userID: '5', itemID: '101', score: '4.0'},
  {userID: '5', itemID: '102', score: '3.0'},
  {userID: '5', itemID: '103', score: '2.0'},
  {userID: '5', itemID: '104', score: '4.0'},
  {userID: '5', itemID: '105', score: '3.5'},
  {userID: '5', itemID: '106', score: '4.0'},
  {userID: '6', itemID: '103', score: '1.0'},
  {userID: '6', itemID: '101', score: '3.0'}
]

var inputMatrix = [
  [5, 3, 2.5, 0, 0, 0, 0],
  [2, 2, 5, 2, 0, 0, 0],
  [2.5, 0, 0, 4, 4.5, 0, 5],
  [5, 0, 3, 4.5, 0, 4, 0],
  [4, 3, 2, 4, 3.5, 4, 0],
  [3, 0, 1, 0, 0, 0, 0]
]

var rowLabels = [...new Set(myData.map(r => r.userID))].sort()
var colLabels = [...new Set(myData.map(r => r.itemID))].sort()


console.log(rowLabels, colLabels)


var matrix = Array(rowLabels.length).fill().map(() => Array(colLabels.length).fill(0))


// console.log(matrix)

rowLabels.forEach((r, rindex) => {
  colLabels.forEach((rrrr, rrrrrindex) => {
    const filter = myData.filter(rr => rr.userID === r && rr.itemID === rrrr)
      .forEach((rr, rrindex) => {
        matrix[rindex][rrrrrindex] = rr.score
      })

  })
})

console.log(matrix)

// console.log(matrix)
// for (let i = 0; i < 2000; ++i ){
var Model = Recommender.buildModel(matrix, rowLabels, colLabels)
var recommendations = Model.rankAllItems(1)
console.log(recommendations)

// var bias = Recommender.calculateBias(inputMatrix);
// var model1 = Recommender.buildModelWithBias(inputMatrix, bias);
// console.log(JSON.stringify(model1,null,2))
// }

