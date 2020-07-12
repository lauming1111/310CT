import os
import csv
import json
import pandas as pd
from .moveFile import moveFile


def csvToJSON(paths, fieldnames):
    for rawCSVPath in paths:
        jsonData = []

        with open(rawCSVPath) as csvFile:
            csvReader = csv.DictReader(
                csvFile, fieldnames=fieldnames)
            for csvRow in csvReader:
                jsonData.append(csvRow)
    else:
        return jsonData
