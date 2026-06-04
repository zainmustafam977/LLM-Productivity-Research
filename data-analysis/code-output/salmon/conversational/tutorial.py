# Tutorial for using an IDE with a conversational AI
numbers = [5,5,5,5,5]

def average(numbers):
    if len(numbers) == 0:
        return None # handle empty list case
    sum = 0
    for num in numbers:
        sum += num
    return sum / len(numbers)


def calculation(lst):
    total = 0
    for num in lst:
        total += num
    return total


print(average(numbers))
print(calculation(numbers))