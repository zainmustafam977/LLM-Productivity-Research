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
    #split the string into a list of words
    words = content.split()
    #calulate total number of words
    total_words = len(words)
    print("\nTotal Words: " + str(total_words))
    #calculate total number of unique words
    unique_words = len(set(words))
    print("\nUnique Words: " + str(unique_words))
    #calculate the average word length
    total_length = 0
    for word in words:
        total_length += len(word)
    average_length = total_length/total_words
    print("\nAverage Word Length: " + str(average_length))
  
    print("\n Stop Words")

    # Feature 2
    #get the list of stopwords in german language

    stop= stopwords.words('german')
    #remove stop words from the list of words and safe into new list
    filteredWords = [word for word in words if word not in stop]
    #calculate the total number of words_without_stopwords
    total_words_without_stopwords = len(filteredWords)
    print("\nTotal Words without Stopwords: " + str(total_words_without_stopwords))
    
    print("\nMost Used Words")

    # Feature 3
    #count the occurences of each word in filteredWords
    word_counts = Counter(filteredWords)
    #get the 10 most common words
    most_common_words = word_counts.most_common(10)
    #print the 10 most common words with format: word: count
    for word in most_common_words:
        print(word[0] + ": " + str(word[1]))
        




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
