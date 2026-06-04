# Tutorial for using an IDE with a conversational AI
lst = [5,5,5,5,5]

def average(lst):
    if len(lst) == 0:
        return 0
    else:
        return sum(lst) / len(lst)

def calculation(lst):
    # Initialize a variable to store the sum of the numbers
    total = 0
    
    # Loop through each element in the list
    for num in lst:
        # Check if the element is a number
        if isinstance(num, (int, float)):
            # Add the number to the total
            total += num
            
    # Return the total sum
    return total


print(average(lst))
print(calculation(lst))