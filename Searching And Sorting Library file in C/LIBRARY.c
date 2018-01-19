#include<stdbool.h>

// Library function to search for the required key using linear search.
void linearSearch(void *arr, void *key, int count, bool (*isEqual)(void *, void * , int ), void (*print)(void *, int ))
{	
	int i;
	for (i=0; i<count; i++)
	{
		if (isEqual(arr, key, i) == true)
			print(arr, i);
	}
	return;
}

// library function that search for the required key using binary search.
int binarySearch(void *arr, void *key, int left, int right, int (*compare)(void *, void * , int ))
{
	if (left > right)
		return(-1);

	int mid = (left + right) / 2;

	if (compare(arr, key, mid) == 0)
		return(mid);
	if (compare(arr, key, mid) > 0)
		return(binarySearch(arr, key, mid+1, right, compare));
	if (compare(arr, key, mid) < 0)
		return(binarySearch(arr, key, left, mid-1, compare));
}

// Library function to sort according to given comparator function using Insertion sort.
void selectionSort(void *arr, int count, int (*comp)(void *, int , int ), void (*swap)(void *, int , int ))
{
	int i, j, minIndex;
	
	for (i=0; i<count-1; i++)
	{
		minIndex = i;
		for (j=i+1; j<count; j++)
		{
			if (comp(arr, j, minIndex) < 0)
				minIndex = j;
		}
		swap(arr, i, minIndex);
	}
	return;
}

// Library function to sort according to the given comparator function using Bubble Sort.
void bubbleSort(void *arr, int count, int (*comp)(void *, int , int ), void (*swap)(void *, int , int ))
{
	int i, j;
	bool moreSwaps;
	for (i=count-1; i>=0; i--)
	{
		moreSwaps = false;
		for (j=0; j<=i-1; j++)
		{
			if (comp(arr, j, j+1) > 0)
			{
				swap(arr, j, (j+1));	// Swap the two record
				moreSwaps = true;
			}
		}	
		if (moreSwaps == false)	// No more swaps left
			break;
	}	
	return;
}

// Library function to sort according to given comparator function using Quicksort.
void quickSort(void *arr, int left, int right, int (*comp)(void *, int , int ), void (*swap)(void *, int , int ))
{
	int i, last;
	if (right > left)	
	{
		swap(arr, left, (left + right)/2);
		last = left;

		for (i = left+1; i <= right; i++)
		{	
			if (comp(arr, i, left) < 0)
			    	swap(arr, ++last, i);				
		}
		swap(arr, left, last);				
		quickSort(arr, left, last-1, comp, swap);
		quickSort(arr, last+1, right, comp, swap);	
	}
	return;
}

// Library function to sort according to given comparator function using Mergesort.
void mergeSort(void *arr, int left, int right, int (*comp)(void *, void *), void (*merge)(void *, int , int , int , int (*)(void *, void *)))
{
	if (left < right)
	{
		int mid = (left + right) / 2;
		
		// First divide the array into two halves.
		mergeSort(arr, left, mid, comp, merge);
		mergeSort(arr, mid+1, right, comp, merge);
		merge(arr, left, mid, right, comp);
	}
	return;
}
© 2018 Git
