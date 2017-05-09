#! /usr/bin/python
import os
import errno
import json
import urllib2
from urlparse import urlparse

bundlePath = os.path.realpath(os.path.dirname(os.path.realpath(__file__)) + "/..")

# Loading Bundle Informations
bundleFile = open(bundlePath + "/Bundle.json")
bundle = json.loads(bundleFile.read())
bundleFile.close()


def relPathParse(path):
    return path.replace("~", os.path.expanduser("~"))

def symLink(src, dst):
    try:
        os.symlink(src, dst)
    except OSError, e:
        if e.errno == errno.EEXIST:
            os.remove(dst)
            os.symlink(src, dst)

def makeFileDirsExists(src):
    exists = os.path.exists(src)
    if exists == False:
        try:
            os.makedirs(os.path.realpath(src + "/../"));
        except:
            pass
    return exists

def pathParse(path):
    return path.replace(" ", "\\ ")

for item in bundle["resources"]:
    # Get absolute paths for the required resource
    resource = bundlePath + "/" + item["resource"]
    src = relPathParse(item["src"])
    # Create all directories safe for the downloading process
    exists = makeFileDirsExists(src)
    if exists == False:
        #os.system('osascript -e \'display alert "Resource not founded" message "Failed to load: ' + resource + '" as critical\'')
        if "error" in item:
            # Writing args for Download.app
            argvFile = open(bundlePath + "/MacOS/Downloader.app/Contents/Resources/argv", "w")
            argvFile.write(src + "," + item["error"]["download"])
            argvFile.close()
            os.system(pathParse(bundlePath + "/MacOS/Downloader.app/Contents/MacOS/applet"))
            pass
    symLink(src, resource)
    pass
execPath = (bundlePath + "/" + bundle["executable"]).replace(" ", "\\ ");
#execPath = (bundlePath + "/" + bundle["executable"]).replace(" ", "\\ ") + " " + (bundlePath + "/Resources/electron_package").replace(" ", "\\ ")

print execPath

#os.system('osascript -e \'display alert "' + "Lauchning Python Script :)" + '"\'')


res = os.system(execPath)
