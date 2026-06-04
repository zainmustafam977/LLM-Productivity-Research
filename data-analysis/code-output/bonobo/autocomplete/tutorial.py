# Tutorial for using an IDE with AI autocomplete
numbers = [5,5,5,2,5]

def sum(numbers):
    total = 0
    for number in numbers:
        total += number
    return total



# Funciont that calculates the average of a list of numbers
def average(numbers):
    total = sum(numbers)
    return total / len(numbers)

def lowest(numbers):
    low = numbers[0]
    for number in numbers:
        if number < low:
            low = number
    return low

print(average(numbers))