#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    #add 150 to x to move the text to the right
    newX = x + 150 # Feature 2
    return newX

def newY(y):
    height = 3508
    #subtract y from height to move the text to the top
    newY = height - y - 250 # Feature 3
    
    return newY

#function to spliot the summary into multiple lines
def splitSummary(summary):
    words = summary.split()
    newSummary = ""
    lineLength = 0
    for word in words:
        if lineLength + len(word) > 100:
            newSummary += "\n"
            lineLength = 0
        newSummary += word + " "
        lineLength += len(word)
    return newSummary

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, Feature 2, Feature 3
    # Print title of the pdf
    pdf.drawString(newX(0), newY(0), title)
    #Print link on the pdf
    pdf.drawString(newX(0), newY(100), link)
    #Print text lines on the pdf
    pdf.
    
    pdf.drawText(newX(0), newY(200), summary)

    pdf.save() #Saves the pdf in the same folder as the main.py file

def outputinConsole(title,link,summary):
    print("\nTitle: " + title)
    print("Link: " + link)
    print("Summary: " + summary[:300] + "...")

if __name__ == '__main__':

    search_term = input("\nEnter search term: ")

    try:
        page = wikipedia.page(search_term)
        print("Topic was found.")
        outputinConsole(page.title, page.url, page.summary)
        createPDF(page.title, page.url, page.summary)
    except wikipedia.exceptions.DisambiguationError as e:
        print("The search term is ambigious. Please select a specific topic.")
        options = '\n'.join(e.options)
        print(options)
    except wikipedia.exceptions.PageError as e:
        print("The search term did not lead to any matches.")

