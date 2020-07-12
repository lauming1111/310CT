import os
import csv
import json
import pandas as pd
from .csvToJSON import csvToJSON
from .moveFile import moveFile


def handleRR(paths, cwd, getFileNameFromPath):
    print("Sorting RR files from old to new")
    paths.sort()
    print(paths)
    # for rawCSVPath in paths:
    #     jsonData = []
    #
    #     with open(rawCSVPath) as csvFile:
    #         csvReader = csv.DictReader(
    #             csvFile, fieldnames=["userID"])

    csv_json = csvToJSON(paths, ["userID"])
    c_model = csvToJSON([os.path.join(cwd, "processed", "currentModel.csv")], ["userID", "itemID", "score"])

    print(csv_json)
    print(c_model)
    # moveFile(rawCSVPath, os.path.join(
    #     cwd,  "processed", getFileNameFromPath(rawCSVPath)))
