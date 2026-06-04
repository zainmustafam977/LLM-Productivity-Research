#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x + 150     # Feature 2
    return newX

def newY(y):
    height = 3508
    newY = 3508 - y - 250     # Feature 2
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, Feature 2, Feature 3
    pdf.drawString(newX(0),newY(0),title)
    pdf.drawString(newX(0),newY(100),link)

    cursorY = 200
    lineheight = 50
    line = ""
    words = summary.split()
    for word in words:
        line = line + " " + word
        print(len(line))
        if(len(line) > 100):
            pdf.drawString(newX(0),newY(cursorY),line)
            line = ""
            cursorY = cursorY + lineheight

    pdf.drawString(newX(0),newY(cursorY),line)

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

