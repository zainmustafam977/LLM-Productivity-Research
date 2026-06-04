# Tutorial for using an IDE with AI autocomplete
numbers = [5,5,5,5,5]

#retuns the average of a list
def average(list):
    total = 0
    for i in list:
        total += i
    return total/len(list)
    

def calculation(list):
    #returns the sum of a list
    total = 0
    for i in list:
        total += i
    return total
    

print(average(numbers))
print(calculation(numbers))