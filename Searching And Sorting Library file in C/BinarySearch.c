#include<dlfcn.h>
#include<stdio.h>
#include<stdlib.h>
#include<string.h>

// A structure which holds the detail of a record.
struct record
{
	int recordID;
	char name[100];
}RecordArray[1000];

int (*binarySearch)(void *arr, void *key, int left, int right, int (*compare)(void *, void * , int ));

// A comparator function to compare by ID.
int compareByID(void *arr, void *key, int index)
{
	int *ID = (int *)key;
	struct record *elem = ((struct record *)(arr) + index);

	if (*ID == elem->recordID)
		return(0);
	else if (*ID > elem->recordID)
		return(1);
	else
		return(-1);
}

// A comparator function to compare by name.
int compareByName(void *arr, void *key, int index)
{
	char *name = (char *)key;	
	struct record *elem = ((struct record *)(arr) + index);
	return strcmp(name, elem->name);
}

// Function which calls the "actual" binary search method in the library.
void binarySearchRecords(int choice, int recordsCount)
{
	switch(choice)
	{
		case 1 :
		{
			printf("Enter the ID to search for-  ");
			int recordID;
			scanf("%d", &recordID);
			
			printf("\nPrinting the record with the Record ID- \"%d\" -\n\n", recordID);
			
			int index = binarySearch(RecordArray, &recordID, 0, recordsCount-1, &compareByID);
			if(index == -1)
				printf("No such record found\n");
			else
				printf("[ID = %d, Name = %s]\n", RecordArray[index].recordID, RecordArray[index].name);
			break;
		}
		case 2 :
		{ 
			printf("Enter the name to search for-  ");	
			getchar();
			char recordName[100];
			scanf("%[^\n]s", recordName);
			
			printf("\nPrinting the record with the Name- \"%s\" -\n\n", recordName);

			int index = binarySearch(RecordArray, recordName, 0, recordsCount-1, &compareByName);
			if(index == -1)
				printf("No such RecordArray found\n");
			else
				printf("[ID = %d, Name = %s]\n", RecordArray[index].recordID, RecordArray[index].name);
			break;
		}
	}
	return;
}

int main(int argc, char *argv[])
{
	if(argc == 2)
	{
		void* lib = dlopen("./libLIBRARY.so", RTLD_LAZY);		
		binarySearch = dlsym(lib, "binarySearch");
		
		int recordsCount;	// The number of records
		
		printf("Enter the number of records - ");
		scanf("%d", &recordsCount);
		
		int i;
		for(i=0; i<recordsCount; i++)
		{
			printf("\nEnter the details\n\nRecord #%d-\n", i+1);
			
			printf("Enter the Unique Record ID of the record  ");
			scanf("%d", &RecordArray[i].recordID);
	
			printf("Enter the Record name of the record  ");	
			getchar();
			scanf("%[^\n]s", RecordArray[i].name);
		}
		binarySearchRecords((strcmp(argv[1], "1") == 0) ? 1 : 2, recordsCount);
	}
	return(0);
}
