//
//  AppDelegate.m
//  Trackpad Gesture Listener
//
//  Created by Maurice Conrad on 27.04.17.
//  Copyright © 2017 Maurice Conrad. All rights reserved.
//

#import "AppDelegate.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)aNotification {
    // Insert code here to initialize your application
    
    [NSEvent addGlobalMonitorForEventsMatchingMask:NSFlagsChangedMask
                                           handler:^(NSEvent* aEvent){
                                               if( [aEvent modifierFlags] & NSCommandKeyMask )
                                               {
                                                   NSLog( @"Command was pressed" );
                                               }   
                                           }];
}


- (void)applicationWillTerminate:(NSNotification *)aNotification {
    // Insert code here to tear down your application
}


@end
