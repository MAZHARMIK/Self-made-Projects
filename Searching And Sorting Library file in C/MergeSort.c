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

void (*mergeSort)(void *arr, int left, int right, int (*comp)(void *, void *), void (*merge)(void *, int , int , int , int (*)(void *, void *)));

// A comparator function to compare by ID.
int compareByID(void *p1, void *p2)
{
	struct record * elem1 = (struct record *)p1;
	struct record * elem2 = (struct record *)p2;
	
	if ( elem1->recordID < elem2->recordID)
	return -1;
	else if (elem1->recordID > elem2->recordID)
	return 1;
	else
	return 0;
}

// A comparator function to compare by name.
int compareByName(void *p1, void *p2)
{
	struct record * elem1 = (struct record *)p1;
	struct record * elem2 = (struct record *)p2;
	return strcmp(elem1->name, elem2->name);
}

// Merge the subarrays arr[l...m] to arr[m+1...r] such that resultant array is sorted according to the given comparator function.
void merge(void *arr, int left, int mid, int right, int (*comp)(void *, void *))
{
	int i, j, k, size1 = mid - left + 1, size2 = right - mid;	

	// Creating the temporary sub-arrays.
	struct record * subArr1 = (struct record *) malloc(size1 * sizeof(struct record));
	struct record * subArr2 = (struct record *) malloc(size2 * sizeof(struct record));

	// Fill the subarrays.
	for (i = 0; i < size1; i++)
		subArr1[i] = *((struct record *)(arr) + left + i);
	for (j = 0; j < size2; j++)
		subArr2[j] = *((struct record *)(arr) + mid + 1 + j);

	// Merging steps starts.
	i = 0, j = 0, k = left;  
	while (i < size1 && j < size2)
	{
		if (comp(&subArr1[i], &subArr2[j]) < 0)
		{
			*((struct record *)(arr) + k) = subArr1[i];
		    	i++;
		}
		else
		{
			*((struct record *)(arr) + k) = subArr2[j];
		    	j++;
		}
		k++;
	}

	// Fill the remaining vacant spaces by padding with the remaining elements.
	while (i < size1)
	{
		*((struct record *)(arr) + k) = subArr1[i];
		i++;
	    	k++;
	} 
	while (j < size2)
	{
		*((struct record *)(arr) + k) = subArr2[j];
		j++;
		k++;
	}  
	// Merging steps ends.

	// Free the allocated memory.
	free(subArr1);
	free(subArr2);
	return;
}
 
// Function that calls the "actual" merge sort function in the library.
void mergeSortRecords(int choice, int productsCount)
{
	int i, last;
	switch(choice)
	{
		case 1 :
		{
			mergeSort(RecordArray, 0, productsCount-1, &compareByID, &merge);
		    	break;
		}
		case 2 :
		{
			mergeSort(RecordArray, 0, productsCount-1, &compareByName, &merge);
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
		void* lib = dlopen("./libLIBRARY.so", RTLD_LAZY);
		mergeSort = dlsym(lib, "mergeSort");
		
		int recordsCount;	// The number of records
		
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
				
		mergeSortRecords((strcmp(argv[1], "1") == 0) ? 1 : 2, recordsCount);
		printf("\nMerge Sort-\n");
		printRecords(recordsCount);
	}
	return(0);
}
