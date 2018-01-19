#include<dlfcn.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

// A structure which holds the detail of a record
struct record
{
	int recordID;
	char name[100];
}RecordArray[1000];

void (*selectionSort)(void *arr, int count, int (*comp)(void *, int , int ), void (*swap)(void *, int , int ));

// Swap the records in the list.
void swapRecords(void *arr, int index1, int index2)
{
	struct record *elem1 = ((struct record *)(arr) + index1);	
	struct record *elem2 = ((struct record *)(arr) + index2);

	struct record temp = *((struct record *)(arr) + index1);
	*((struct record *)(arr) + index1) = *((struct record *)(arr) + index2);
	*((struct record *)(arr) + index2) = temp;
	return;	
}

// A comparator function to compare by ID.
int compareByID(void *arr, int index1, int index2)
{
	struct record *elem1 = ((struct record *)(arr) + index1);	
	struct record *elem2 = ((struct record *)(arr) + index2);

	if ( elem1->recordID < elem2->recordID)
		return -1;
	else if (elem1->recordID > elem2->recordID)
		return 1;
	else
		return 0;
}

// A comparator function to compare by name.
int compareByName(void *arr, int index1, int index2)
{
	struct record *elem1 = ((struct record *)(arr) + index1);	
	struct record *elem2 = ((struct record *)(arr) + index2);
	return strcmp(elem1->name, elem2->name);
}

// Function that calls the "actual" selection sort function in the library.
void selectionSortRecords(int choice, int recordsCount)
{
	int i, last;
	switch(choice)
	{
		case 1 :
		{
			selectionSort(RecordArray, recordsCount, &compareByID, &swapRecords);
		    break;
		}
		case 2 :
		{
		    selectionSort(RecordArray, recordsCount, &compareByName, &swapRecords);
			break;
		}
	}
	return;
}

// A helper function to print all the records.
void printRecords(int recordsCount)
{
	printf("\nPrinting the records...\n\n");
	int i;
	for (i=0; i<recordsCount; i++)
	{
		printf("record #%d-\t", i+1);
		printf("[ID = %d, Name = %s]\n", RecordArray[i].recordID, RecordArray[i].name);
	}
	return;
}

int main(int argc, char *argv[])
{
	if (argc == 2)
	{
		int recordsCount;	// The number of records
		
		void* lib = dlopen("./libLIBRARY.so", RTLD_LAZY);
		selectionSort = dlsym(lib, "selectionSort");
		
		printf("Enter the number of records - ");
		scanf("%d", &recordsCount);
		
		int i;
		for (i=0; i<recordsCount; i++)
		{
			printf("\nEnter the details\n\nRecord #%d-\n", i+1);
			
			printf("Enter the Unique ID of the record  ");
			scanf("%d", &RecordArray[i].recordID);
	
			printf("Enter the name of the record  ");	getchar();
			scanf("%[^\n]s", RecordArray[i].name);
		}
	
		selectionSortRecords((strcmp(argv[1], "1") == 0) ? 1 : 2, recordsCount);
		printf("\nSelection Sort-\n");
		printRecords(recordsCount);
	}
	return(0);
}
