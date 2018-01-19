#include<dlfcn.h>
#include<stdbool.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

// A structure which holds the detail of a record
struct record
{
	int recordID;
	char name[100];
}RecordArray[1000];

void (*bubbleSort)(void *arr, int productsCount, int (*comp)(void *, int , int ), void (*swap)(void *, int , int ));

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

// Function which calls the "actual" bubble sort function in the library.
void bubbleSortRecords(int choice, int productsCount)
{
	// i, j are the iterating variables.
	int i, j;
	switch(choice)
	{
		case 1 :
		{
			bubbleSort(RecordArray, productsCount, &compareByID, &swapRecords);		
			break;
		}
		
		case 2 : 
		{
			bubbleSort(RecordArray, productsCount, &compareByName, &swapRecords);		
			break;
		}
	}
	return;
}

// A helper function to print all the record
void printProducts(int productsCount)
{
	printf("\nPrinting the record...\n\n");
	int i;
	for(i=0; i<productsCount; i++)
	{
		printf("Product #%d-\t", i+1);
		printf("[ID = %d, Name = %s]\n", RecordArray[i].recordID, RecordArray[i].name);
	}
	return;
}

int main(int argc, char *argv[])
{
	if(argc == 2)
	{
		void* lib = dlopen("./libLIBRARY.so", RTLD_LAZY);
		bubbleSort = dlsym(lib,"bubbleSort");
		
		int recordCount;	// The number of records.
		
		printf("Enter the number of records - ");
		scanf("%d", &recordCount);
		
		int i;
		for(i=0; i<recordCount; i++)
		{
			printf("\nEnter the details\n\nRecord #%d-\n", i+1);
			
			printf("Enter the Unique Record ID of the record  ");
			scanf("%d", &RecordArray[i].recordID);
	
			printf("Enter the Record name of the record  ");	
			getchar();
			scanf("%[^\n]s", RecordArray[i].name);
		}	
		bubbleSortRecords((strcmp(argv[1], "1") == 0) ? 1 : 2, recordCount);
		printf("\nBubble Sort-\n");
		printProducts(recordCount);
	}
	return 0;
}
