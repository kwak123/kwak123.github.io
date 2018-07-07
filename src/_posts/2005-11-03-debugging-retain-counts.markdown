---
author: Aaron Hillegass
date: 2005-11-03 01:59:14+00:00
layout: post
title: Debugging retain counts
path: /blog/debugging-retain-counts
wordpress_id: 2
categories:
- Mac
- Leveling Up
---

This article, originally published in _MacTech Magazine_, gives tips on how to write your code such that retain count problems are easier to find and how to locate the problem when symptoms appear.



<!-- more -->



Before delving into all the ways to find them, let's quickly review the lifetime of an object on the heap.  The object is allocated (through the **+allocWithZone:** method which calls the **malloc_zone_calloc()** function),  it is used, and then it is deallocated (through the **-dealloc** method which calls the **malloc_zone_free()** function).





Complicating matters is the retain count.  A newly allocated object has a retain count of 1.  When an object is retained, the retain count is incremented. When it is released, the retain count is decremented.  When the retain count goes to zero, the object is deallocated.





This is complicated even further by the autorelease pool.  When an object is sent the message **autorelease**, it adds itself to the current autorelease pool.  When the autorelease pool is deallocated, it send the message **release** to every object in the pool.  In a Cocoa application, the autorelease pool is deallocated after each event is handled.





## Use release when possible





Here are two similar erroneous methods:



    - (void)bad
    {
        NSArray *array = [[NSArray alloc] init];
        [array release];
        [array release];
    }

    - (void)worse
    {
        NSArray *array = [[NSArray alloc] init];
        [array release];
        [array autorelease];
    }



If the first method is run inside a debugger,  it will stop on the erroneous line with a BAD_ACCESS error.  The second method will cause a BAD_ACCESS only when the autorelease pool is deallocated. In a large program, it may be difficult to back track to where you autoreleased that object. Using **release**, besides being more efficient, will make your code easier to debug.





Likewise, use **init** instead of a convenience method and a **retain**.  For example:



    NSString *x;
    x = [NSString stringWithFormat:@"I like %d!", 2];
    [x retain];





is not as good as:





    NSString *x;
    x = [[NSString alloc] initWithFormat:@"I like %d!", 2];







Note that this does not mean that you should break conventions: when creating an object to be vended out, it should be autoreleased:





    - (NSNumber *)currentPrice
    {
        NSNumber *p;
        p = [[NSNumber alloc] initWithInt:(whatMarketWillBear - 1)];
        [p autorelease];
        return p;
    }







## Set Pointers to nil after Objects are Released





To make it impossible to send messages to released objects, set the pointer to nil after the object is released:





    - (void)fireThem
    {
       [employees release];
       employees = nil;
    }






## Using Zombies





This code (which uses an object after it has been deallocated) often runs without crashing or throwing exceptions:






    - (IBAction)stupidAction:(id)sender
    {
        NSMutableString *string = [[nameField stringValue] mutableCopy];
        [string release];
        NSMutableString *p;
        p = [NSMutableString stringWithFormat:@"I'm new!"];
        NSLog(@"string = %@", string);
    }






The new string object is sometimes created in the same place in memory that the old one had occupied.  So, when you run this you sometimes see:





    string = I'm new!






On the other hand, sometimes the new string isn't created in the same location and the application crashes with a BAD_ACCESS.  As you can imagine, hunting down a bug that may or may not rear its ugly head can be maddening.





To debug this code, instead of freeing the memory for reuse, turn the objects into zombies.  When you try to use a zombie, Cocoa will throw an exception.  Thus, you can consistently reproduce this bug.  The trick, then, is to tell Foundation and CoreFoundation, that you want to zombify your objects instead of freeing them.





First, you need to use the debug version of the CoreFoundation framework.  To do this, select your executable in Xcode, and in the inspector under the General tab, choose "Use the debug suffix when loading frameworks."


Then, under the Arguments tab, set the environment variable NSZombieEnabled to YES and CFZombieLevel to 3 (screenshot should have 3, not 5).


Now when you send a message to a released object you will get a nice exception like this:





    *** Selector 'respondsToSelector:' sent to dealloced instance 0x328840 of class NSMutableString.





(Remember to disable zombies once the bug is found -- you want the objects to be freed, not zombified in a deployed app.)





## Putting a breakpoint on exceptions





Now that you have an exception that is thrown consistently, you will need to create a breakpoint in the debugger where the exception gets raised. Before dealing with the debugger, let's review how exceptions get thrown.





The Cocoa libraries check certain conditions, and if the conditions are not met, they raise exceptions.  For example, if you ask for the second item in an array that has only one item,  an exception will be thrown.  Throwing an exception looks like this:





    if (x == 13) {
        NSException *badness;
        badness = [NSException exceptionWithName:@"BadLuckException"
                                          reason:@"13 is unlucky"
                                        userInfo:nil];
        [badness raise];
    }






Thus, to stop the debugger as soon as an exception is raised,  you can add the breakpoint for **-[NSException raise]** using the  breakpoint panel.




Gradually, Cocoa programmers are moving to the new @throw/@catch/@finally form of exceptions stolen from C++ and Java. In this form, you will throw exceptions like this:





        NSException *badness;
        badness = [NSException exceptionWithName:@"BadLuckException"
                                          reason:@"13 is unlucky"
                                        userInfo:nil];

        @throw badness;





(To use new-style exceptions, you must pass the **-fobjc-exceptions** flag to the compiler.)





To detect when an exception is being thrown from within the debugger, you will want to create a breakpoint on **objc_exception_throw**.





You will want these breakpoints every time you run the debugger. To automatically add these breakpoints anytime you use gdb,  create a .gdbinit file in your home directory and include these lines:





    fb -[NSException raise]
    fb objc_exception_throw()






In summary, here are the four tips for this week:




  * release instead of autorelease when possible


  * After releasing an object, set pointers to it to nil


  * Use zombies to hunt down retain/release problems


  * Add breakpoints to stop on exceptions


I hope they are useful to you.
