---
author: Aaron Hillegass
date: 2005-12-05 16:22:14+00:00
layout: post
title: Life with SQLite
path: /blog/life-sqlite
wordpress_id: 12
categories:
- Mac
---

With Tiger, Apple has started using SQLite in many ways.  Most notably, SQLite is the recommended store for Core Data applications. This column, which originally appeared in _MacTech Magazine_ covers some of the things any Cocoa developer should know about SQLite.



<!-- more -->



#### What is SQLite?





A database server, for example Oracle or PostgreSQL, is a daemon that responds to requests from client applications.  The clients make requests of the server using Structured Query Language (SQL) via some client library. The server takes care of the security, concurrency, and distribution issues. The server stores tables of data that can be indexed for quick random access.





SQLite is _not_ a database server.





SQLite is an open-source C library written by Dr. Richard Hipp.  It creates a file that holds tables of data that can be indexed for quick random access. You read and write to this file using SQL.  The main advantage of SQLite over archiving is that the data can read and updated incrementally.  (An archive is read in one big piece, and must be completely rewritten if the resulting object graph is edited.)  The performance and scalability of SQLite is excellent -- Dr. Hipp's mother has every right to be very proud of him.





You can learn all about SQLite at the website: [http://www.sqlite.org/](http://www.sqlite.org/)





#### Looking at SQLite files





SQLite comes with a command-line tool called **sqlite3**. The tool is installed automatically with Tiger. Using **sqlite3**, you can interactively inspect and edit any SQLite file.  If you are curious about how Core Data structures the file, **sqlite3** is a great way to explore it. **sqlite3** has several non-SQL commands that start with a dot.  **.schema** will show you the create statements for all the tables and indices in the file:





    % <b>sqlite3 test.eventsq</b>
    sqlite> <b>.schema</b>
    CREATE TABLE ZLOCATION
        (Z_ENT INTEGER, Z_PK INTEGER PRIMARY KEY, Z_OPT INTEGER,
        ZDETAILDESCRIPTION VARCHAR, ZNAME VARCHAR );
    CREATE TABLE ZPERSON
        (Z_ENT INTEGER, Z_PK INTEGER PRIMARY KEY, Z_OPT INTEGER,
        ZNOTES VARCHAR, ZFIRSTNAME VARCHAR, ZLASTNAME VARCHAR );
    ...
    CREATE INDEX ZEVENT_ZOCCASION_INDEX ON ZEVENT (ZOCCASION);
    sqlite>  <b>select * from zperson;</b>
     5 | 1 | 1 | Bride  | Laura | Smith
     5 | 2 | 1 | Groom  | Craig | Adams






#### Watching the SQL executed by Core Data





This tip requires that you use some API that Apple has not yet exposed, and I would not use it in a shipping application.  It is, however, a great way to understand exactly what Core Data is doing with SQLite.  To log every SQL command sent to SQLite,  execute the following code early in your application:





    Class privateClass;
    privateClass = NSClassFromString(@"NSSQLConnection");
    // The compiler will give a warning here
    [privateClass setDebugDefault:YES];






#### Using SQLite in non-Core Data applications





There are a couple of reasons why you might want to write an application that works with SQLite files, but doesn't use Core Data:




  * Backwards compatibility:  Core Data is only available on Tiger.


  * Performance: While Core Data is very clever about which rows to fetch from a sqlite file, it fetches all the columns for those rows.  If you know that you only need one or two columns,  you may get a significant performance win from writing an explicit SELECT statement.








QuickLite is an Objective-C wrapper for SQLite by Tito Ciuro.  It is an open source framework, and you can download it at: [http://www.webbotech.com/](http://www.webbotech.com/)





One of the QuickLite example programs is SQLiteManagerX, a handy Cocoa application for browsing and editing SQLite files:![](images/managerx.png)





#### SQLite is not a database server





Before we end this, let us remind you that SQLite is not a database server.  If more than one user is going to be accessing the data, you need a database server to take care of security, distribution, and concurrency issues.  (There are, for example, many stories of companies trying to use Microsoft Access as a networked datastore.  Most of the stories end with tears and a massive rewrite.)  If your data is accessed by only one user at a time,  SQLite is an elegant and efficient solution.
