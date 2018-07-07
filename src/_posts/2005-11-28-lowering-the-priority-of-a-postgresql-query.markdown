---
author: Chris Kelly
date: 2005-11-28 15:18:58+00:00
layout: post
title: Lowering the priority of a PostgreSQL query
path: /blog/lowering-postgres-priority
wordpress_id: 11
---

When maintaining a large database system that requires high availability, there are times when you want to run some maintenance queries without impacting the performance of other users accessing the database. A nightly script that cleans up old data or updates cached calculations is a good example: the maintenance should be performed, but not at the expense of other connected users.

One way to accomplish this is to lower the priority of the PostgreSQL process executing the maintenance queries.

<!-- more -->



#### Introduction


PostgreSQL has many built-in functions for [performing mathematical operations](http://www.postgresql.org/docs/8.1/interactive/functions-math.html), [string processing](http://www.postgresql.org/docs/8.1/interactive/functions-string.html), [pattern matching](http://www.postgresql.org/docs/8.1/interactive/functions-matching.html), [date and time calculations](http://www.postgresql.org/docs/8.1/interactive/functions-datetime.html), [introspecting the database](http://www.postgresql.org/docs/8.1/interactive/functions-info.html), and [much more](http://www.postgresql.org/docs/8.1/interactive/functions.html). But even more powerful is the ability to create your own functions and call them from SQL queries. You can use just about any language to write the function (Python, Perl, PHP, TCL, Java, bash, etc). In this article, we're going to write a function in C, compile it into a shared library that PostgreSQL can load, and call it from a SQL query.

Each connection to the PostgreSQL database is handled by its own process running on the server computer. The operating system's process management tools (like ps, top, and renice) can be used to examine processes and change their priority. In order to change the priority from our function that's executing inside the process, we'll use the **setpriority()** system call.



#### The function



Our C function will be called **pg_setpriority** and will take in an integer argument representing the new priority for the process. Since it needs to simply call through to the **setpriority()** system call, the code is short and sweet:




    Datum
    pg_setpriority(PG_FUNCTION_ARGS)
    {
        int32 priority = PG_GETARG_INT32(0);

        int result = setpriority(PRIO_PROCESS, 0, priority);

        if (result == 0) {
            PG_RETURN_BOOL(1); /* true */
        } else {
            PG_RETURN_BOOL(0); /* false */
        }
    }




See the man page for **setpriority()** for more information about how the function works on your operating system. In a nut shell, the first argument specifies that the we're changing the priority of a single process, the second argument specifies the current process, and the third argument is the desired priority. The priority is a number from -20 to 20, where -20 is the highest priority and 20 is the lowest. Only root can raise the priority of a process (by specifying a lower number), so we'll only be able to use this function to lower priorities.

The complete pg_setpriority.c file is shown below. It adds some `#include` statements and a macro invocation that creates a data structure to represent the function.




    #include <sys/time.h>
    #include <sys/resource.h>

    #include "postgres.h"
    #include "fmgr.h"

    PG_FUNCTION_INFO_V1(pg_setpriority);

    Datum
    pg_setpriority(PG_FUNCTION_ARGS)
    {
        int32 priority = PG_GETARG_INT32(0);

        int result = setpriority(PRIO_PROCESS, 0, priority);

        if (result == 0) {
            PG_RETURN_BOOL(1); /* true */
        } else {
            PG_RETURN_BOOL(0); /* false */
        }
    }






#### Compiling C functions on PostgreSQL 7.x



PostgreSQL 8.0 and later automatically installs header files needed for compiling server-side C functions (postgres.h, fmgr.h, etc). For earlier versions of PostgreSQL, you need to run the following command inside the directory that contains the PostgreSQL source code before following the later steps in this article:




    $ <strong>sudo make install-all-headers</strong>






#### Steps to Priority-Lowering Nirvana



1. Save the pg_setpriority.c file on your computer.

2. Compile the C code into object code (creating a pg_setpriority.o file). If pg_config isn't in your PATH, specify the full path to it (/usr/local/pgsql/bin/pg_config by default).

Mac OS X:



    $ <strong>gcc -Wall -I `pg_config --includedir-server` -c pg_setpriority.c</strong>




Linux:



    $ <strong>gcc -Wall -I `pg_config --includedir-server` -fpic -c pg_setpriority.c</strong>




3. Turn the object code into a shared library (creating a pg_setpriority.so file).

Mac OS X:



    $ <strong>gcc -bundle -flat_namespace -undefined suppress -o pg_setpriority.so pg_setpriority.o</strong>




Linux:



    $ <strong>gcc -shared -o pg_setpriority.so pg_setpriority.o</strong>




4. Copy the shared library into the PostgreSQL dynamic library directory (/usr/local/pgsql/lib by default). Again, if pg_config isn't in your PATH, specify the full path to it.




    $ <strong>sudo cp pg_setpriority.so `pg_config --pkglibdir`</strong>




5. Inside your PostgreSQL database, create the SQL side of the function that will be called from queries.




    $ <strong>psql -U postgres mydb</strong>
    Welcome to psql 8.1.0, the PostgreSQL interactive terminal.

    Type:  \copyright for distribution terms
           \h for help with SQL commands
           \? for help with psql commands
           \g or terminate with semicolon to execute query
           \q to quit

    mydb=# <strong>CREATE FUNCTION pg_setpriority(INTEGER) RETURNS BOOLEAN AS '$libdir/pg_setpriority'
    LANGUAGE C STRICT;</strong>
    CREATE FUNCTION




6. Use the function in your queries.

To lower the priority of your PostgreSQL process before executing a query, you just need to call the new **pg_setpriority()** function and pass in the lowered priority (10 is a good low-priority value) before running other queries. The process will have the lowered priority for the rest of its life. If you want to return to a higher priority, you should terminate the connection and open a new one.

For example, let's say you have a script that cron runs every night to do some text substitutions in new blog_comment records:




    #!/bin/bash
    #
    # nightly-maintenance.sh
    #
    psql -U postgres mydb <<EOF
    UPDATE blog_comment SET comment_text =
        replace(comment_text, 'terrible product', 'fantastic time-saver');
    UPDATE blog_comment SET comment_text =
        replace(comment_text, 'want my money back', 'love this thing');
    ...




To have these queries run with a lower priority, add a call to the **pg_setpriority()** function right after connecting to the database:




    #!/bin/bash
    #
    # nightly-maintenance.sh
    #
    psql -U postgres mydb <<EOF
    <strong>SELECT pg_setpriority(10);</strong>
    UPDATE blog_comment SET comment_text =
        replace(comment_text, 'terrible product', 'fantastic time-saver');
    UPDATE blog_comment SET comment_text =
        replace(comment_text, 'want my money back', 'love this thing');
    ...




This is just one example of how easy it is to create powerful functions in C that can be used inside SQL queries to leverage existing C libraries or use system calls to manipulate server-side resources.