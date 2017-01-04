# Self-made-Projects
Searching And Sorting Library filein C. This project is done by me and my group member Rachit Belwariar.

A library containing various searching and sorting functions to search and sort a list of structures(records) according to the given comparator function.

The main objective of this project is to provide the same flexibility as C's qsort() in other searching and sorting algorithms. The searching and soring functions in the given library (LIBRARY.c) can be used for any type (including user defined types) and can be used to obtain any desired order (increasing, decreasing or any other).

How to use the code?

Linux Users

To generate a shared library first compile the library (LIBRARY.c) with the "-fPIC" (position independent code) flag- gcc -shared -o libLIBRARY.so -fPIC LIBRARY.c.
Compile the sorting/searching algorithm by using the command- gcc FILENAME.c -ldl , e.g. to run the QuickSort write- gcc QuickSort.c -ldl. The "-ldl" is used to link the dynamic library. 
There are two fields in our structure- ID(integer type) and name(string type). Hence, pass 1 to search/sort by ID and 2 to search/sort by name, i.e- "./a.out 1" and "./a.out 2" respectively.
Windows Users

Since the methods like- dlopen(), dlsym() are only available in Linux, hence the above steps won't work in Windows OS. Although one can put the functions present in the library (LIBRARY.c) in a header file, say- LIBRARY.h and then include the header in the code where those functions are to be called by adding- #include "LIBRARY.h" after setting up the proper path for the compiler to find it.
