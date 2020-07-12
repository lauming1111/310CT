import os
import csv
import json
from .moveFile import moveFile
from .csvToJSON import csvToJSON


def handleUP(paths, cwd, getFileNameFromPath):
    print("Sorting UP files from old to new")
    paths.sort()
    print(paths)

    csv_json = csvToJSON(paths, ["userID", "itemID", "score"])
    c_model = csvToJSON([os.path.join(cwd, "processed", "currentModel.csv")], ["userID", "itemID", "score"])

    print(csv_json)
    print(c_model)


    # moveFile(rawCSVPath, os.path.join(
    #     cwd,  "processed", getFileNameFromPath(rawCSVPath)))
