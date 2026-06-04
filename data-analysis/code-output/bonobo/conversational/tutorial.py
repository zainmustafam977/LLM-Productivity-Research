# Tutorial for using an IDE with a conversational AI
numbers = [5,5,5,5,5]


import math

def calc_avg_std(nums):
    # Calculate average
    avg = sum(nums) / len(nums)
    
    # Calculate standard deviation
    std = math.sqrt(sum((x - avg) ** 2 for x in nums) / len(nums))
    
    return avg, std

avg, std = calc_avg_std(numbers)

print("Numbers:", numbers)
print("Average: {:.2f}".format(avg)) # round to 2 decimal places
print("Standard Deviation: {:.2f}".format(std)) # round to 2 decimal places
