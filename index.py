import pandas as pd
import numpy as np
import os
import csv
import json
import ntpath

from functions.createDir import createDir
from functions.handleRR import handleRR
from functions.handleUP import handleUP

cwd = os.getcwd()
print("The current working directory is %s" % cwd)


def getFileNameFromPath(r):
    return ntpath.basename(r)


def filterByFileName(r, filter):
    # filter by file name prefix
    results = []
    for rawCSVPath in input_remaining:
        name = getFileNameFromPath(rawCSVPath)
        if name.startswith(filter) == True:
            results.append(rawCSVPath)
    else:
        return results


# create path if not exist
paths = ["input", "processed", "output"]
createDir(cwd, paths)

input_remaining = []
for root, dirs, files in os.walk(os.path.abspath("input")):
    for file in files:
        file.endswith(".csv") == True and input_remaining.append(
            os.path.join(root, file))

else:
    print(input_remaining)

userPrefer = filterByFileName(input_remaining, 'UP')
RRequest = filterByFileName(input_remaining, 'RR')

# handleRR(RRequest, cwd, getFileNameFromPath)
handleUP(userPrefer, cwd, getFileNameFromPath)
