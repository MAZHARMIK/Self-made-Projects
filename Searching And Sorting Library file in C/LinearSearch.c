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

void (*linearSearch)(void *arr, void *key, int count, bool (*isEqual)(void *, void * , int ), void (*print)(void *, int ));

// A helper method to print the desired value from the array.
void printRecord(void *arr, int index)
{
	struct record *elem = ((struct record *)(arr) + index);	
	printf("[ID = %d, Name = %s]\n", elem->recordID, elem->name);
	return;
}

// A function to check for the existence of the key in the record array at the given index for equality.
bool isIDEqual(void *arr, void *key, int index)
{
	int *ID = (int *)key;
	struct record *elem = ((struct record *)(arr) + index);

	if (*ID == elem->recordID)
		return(true);
	else
		return(false);
}

// A function to check for the existence of the key in the record array at the given index for equality.
bool isNameEqual(void *arr, void *key, int index)
{
	char *name = (char *)key;	
	struct record *elem = ((struct record *)(arr) + index);

	if(strcmp(elem->name, name)==0)
		return true;
	else
		return false;
}

//Function which calls the "actual" linear search in the library.
void linearSearchRecords(int choice, int recordsCount)
{
	switch(choice)
	{
		case 1 :
		{
			printf("\nEnter the ID to search for-  ");
			int recordID;
			scanf("%d", &recordID);
			linearSearch(RecordArray, &recordID, recordsCount, &isIDEqual, &printRecord);		
			break;
		}
		case 2 :
		{
			printf("\nEnter the name to search for-  ");	
			getchar();
			char recordName[100];
			scanf("%[^\n]s", recordName);
			linearSearch(RecordArray, recordName, recordsCount, &isNameEqual, &printRecord);		
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
		linearSearch = dlsym(lib,"linearSearch");

		int recordsCount; 		// The number of records.
		
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
		linearSearchRecords((strcmp(argv[1], "1") == 0) ? 1 : 2, recordsCount);
	}
	return(0);
}
