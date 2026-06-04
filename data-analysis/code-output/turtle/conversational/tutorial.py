# Tutorial for using an IDE with a conversational AI
def average(numbers):
    total = sum(numbers)
    return total / len(numbers)
my_numbers = [1, 2, 3, 4, 5]
result = average(my_numbers)
print(result) # Output: 3.0


def calculation(numbers):
    total_sum = sum(numbers)
    total_product = 1
    for num in numbers:
        total_product *= num
    return (total_sum, total_product)
my_numbers = [1, 2, 3, 4, 5]
result = calculation(my_numbers)
print(result) # Output: (15, 120)
def average(numbers):
    return sum(numbers) / len(numbers)
numbers = [1, 2, 3, 4, 5]
print(average(numbers))


print(average(numbers))
print(calculation(numbers))