import os
import csv
import json
from .moveFile import moveFile
from .csvToJSON import csvToJSON
import pandas as pd


def handleUP(paths, cwd, getFileNameFromPath):
    print("Sorting UP files from old to new")
    paths.sort()
    print(paths)

    csv_json = csvToJSON(paths, ["userID", "itemID", "score"])
    c_model = csvToJSON([os.path.join(cwd, "processed", "currentModel.csv")], ["userID", "itemID", "score"])
    print(c_model)
    r = []
    for model in c_model:
        for input in csv_json:
            # if model['userID'] == input['userID']:
            #     if model['itemID'] == input['itemID']:
            #         print("userID and itemID", input, model)
            #         if model['score'] == float(input['score']):
            #             print('existing')
            #             break
            #         else:
            #             model['score'] = float(input['score'])

            if not list(filter((lambda x: input['userID'] != x['userID'] and input['itemID'] != x['itemID'] and float(
                    input['score']) != x['score']), c_model)):
                c_model.append(input)
            # elif list(filter((lambda x: x['userID'] == input['userID'] and x['itemID'] != input['itemID']), c_model)):
            #     input['score'] = float(input['score'])
            #     c_model.append(input)

    pd.DataFrame(c_model).to_csv('PeshVsQuetta.csv', encoding='utf-8', index=False, header=False)
    # print(csv_json)
    # print(c_model)

    # moveFile(rawCSVPath, os.path.join(
    #     cwd,  "processed", getFileNameFromPath(rawCSVPath)))
