import os


def createDir(cwd, paths):

    for path in paths:
        print(path)

        try:
            os.mkdir(os.path.join(cwd, path))
        except:
            print("Creation of the directory %s failed" % path)
        else:
            print("Successfully created the directory %s " % path)
