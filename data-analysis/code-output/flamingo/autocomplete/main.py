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
    # Feature 1
    print("\nText Analysis")
    # convert string to list by splitting on spaces
    word_list = content.split(' ')
    # calculate the number of words
    num_words = len(word_list)
    print('Total number of words: ' + str(num_words))
    # calculate the number of unique words
    num_unique_words = len(set(word_list))
    print('Total number of unique words: ' + str(num_unique_words))
    # calculate the average word length and print to console
    avg_word_length = sum([len(word) for word in word_list]) / num_words
    print('Average length of words: ' + str(avg_word_length))
   
    
    
    # Feature 2
    print("\n Stop Words")
    # create a list of stop words from the NLTK library
    asdf = stopwords.words('english')

    # remove stop words
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in word_list if not word in stop_words]
    
    # calculate and print out the number of words without stop words
    num_words_nostop = len(filtered_words)
    print('Total number of words (no stop words): ' + str(num_words_nostop))
    # calculate and print out the average word length without stop words
    avg_word_length_nostop = sum([len(word) for word in filtered_words]) / num_words_nostop
    print('Average length of words (no stop words): ' + str(avg_word_length_nostop))

    
    print("\nMost Used Words")
    # create a dictionary of words and their frequency
    word_freq = Counter(filtered_words)
    # create a list of tuples sorted by index 1 i.e. value field
    word_freq_sorted = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    # iterate through the list of tuples, printing the top twenty most frequent words
    for word, freq in word_freq_sorted[:20]:
        print(word + " " + str(freq))
    


    # Feature 3




if __name__ == '__main__':
    
    url = 'http://localhost:5000/public/cache/LMU-Article.html'
    content = scrapeURL(url)
    outputContent(content)
    outputAnalysis(content)
