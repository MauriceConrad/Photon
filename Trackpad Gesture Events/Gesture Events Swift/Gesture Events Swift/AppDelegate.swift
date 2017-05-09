//
//  AppDelegate.swift
//  Gesture Events Swift
//
//  Created by Maurice Conrad on 27.04.17.
//  Copyright © 2017 Maurice Conrad. All rights reserved.
//

import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {
    
    @IBOutlet weak var window: NSWindow!
    @IBOutlet var textLabel : NSTextField!
    var eventHandler : public class GlobalEventMonitor {
        
        private var monitor: AnyObject?
        private let mask: NSEventMask
        private let handler: NSEvent? -> ()
        
        public init(mask: NSEventMask, handler: NSEvent? -> ()) {
            self.mask = mask
            self.handler = handler
        }
        
        deinit {
            stop()
        }
        
        public func start() {
            monitor = NSEvent.addGlobalMonitorForEventsMatchingMask(mask, handler: handler)
        }
        
        public func stop() {
            if monitor != nil {
                NSEvent.removeMonitor(monitor!)
                monitor = nil
            }
        }
    }
    var gecount : Int = 0
    
    func applicationDidFinishLaunching(aNotification: NSNotification) {
        
        eventHandler = GlobalEventMonitor(mask: .LeftMouseDownMask, handler: { (mouseEvent: NSEvent?) in
            self.gecount += 1
            self.textLabel.stringValue = "global event monitor: \(self.gecount)"
        })
        eventHandler?.start()
    }
}

