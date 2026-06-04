import re
import sys
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.corpus import stopwords

def scrapeURL(url):
    response = requests.get(url)
    html_content = response.content.decode('utf-8') 
    soup = BeautifulSoup(html_content, 'html.parser')
    text = soup.get_text()

    clean_text = re.sub(r'[^\w\s\.]', '', text)
    clean_text = clean_text.lower()
    clean_text = clean_text.replace('\n', '')
    clean_text = clean_text.replace('\t', '')
    clean_text = re.sub(' +', ' ', clean_text)

    return clean_text

def outputContent(content):

    print("\nLink to Article")
    print(url)
    print("\nContent Preview")
    print(content[:500] + "...")


def outputAnalysis(content):

    print("\nText Analysis")
    
    # Feature 1
    listOfWords = content.split()
    print(listOfWords)
    print(len(listOfWords))
    
    # Print the unique values of the list listOfWords
    uniqueWords = set(listOfWords)
    print(uniqueWords)

    # Calculate the average length of the values in the list listOfWords
    total = 0
    for i in listOfWords:
        total += len(i)
    print(total/len(listOfWords))
    
  
    print("\n Stop Words")

    # Feature 2
    germanStopwords = stopwords.words('german')
    print(stopwords)

    # Create a new list filteredWords that contains all the words in listOfWords that are not in germanStopwords
    filteredWords = []
    for i in listOfWords:
        if i not in germanStopwords:
            filteredWords.append(i)
    print(filteredWords)
    print(len(filteredWords))

    
    print("\nMost Used Words")

    # Feature 3
    # Use the filteredWords list and count the occurrences of each word (= item) in that list.
    # Print the 10 most common words and their count.
    wordCount = Counter(filteredWords)
    print(wordCount.most_common(10))
    
    for i in wordCount.most_common(10):
        # How can I print the key and the value of each item in the dictionary wordCount?
        key, value = i
        print(key, ": ", value)




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
