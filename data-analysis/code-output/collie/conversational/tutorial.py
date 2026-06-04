# Tutorial for using an IDE with a conversational AI
numbers = [5,5,5,5,5]

def average(lst):
    if len(lst) == 0:
        return None # return None for empty list
    else:
        return sum(lst) / len(lst)


def calculation(lst):
    return sum(lst)


print(average(numbers))
print(calculation(numbers))