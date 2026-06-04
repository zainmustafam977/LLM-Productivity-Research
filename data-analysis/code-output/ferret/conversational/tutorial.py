# Tutorial for using an IDE with a conversational AI
numbers = [5,5,5,5,5]

def average(numbers):
    if len(numbers) == 0:
        return 0
    else:
        return sum(numbers) / len(numbers)

def calculation(lst):
    # Check if list is empty
    if not lst:
        return 0
    
    # Calculate sum of even numbers in the list
    even_sum = sum(num for num in lst if num % 2 == 0)
    
    # Calculate product of odd numbers in the list
    odd_product = 1
    for num in lst:
        if num % 2 != 0:
            odd_product *= num
    
    # Return the difference between even sum and odd product
    return even_sum - odd_product


print(average(numbers))
print(calculation(numbers))