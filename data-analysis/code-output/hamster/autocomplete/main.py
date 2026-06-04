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
    newY = y     # Feature 2
    # Invert newY to make the pdf file start at the top
    newY = height - newY - 250 
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, Feature 2, Feature 3
    # Draw the title for the pdf file at x=0 and y=0
    pdf.drawString(newX(0), newY(0), title)
    # Draw the link for the pdf file at x=0 and y=100
    pdf.drawString(newX(0), newY(100), link)
    #Draw the summary for the pdf file at x=0 and y=200
    pdf.drawString(newX(0), newY(200), summary)
    # Split summary into a list of words
    summaryList = summary.split()
    # iterate through the list of words summaryList and add the strings back together with a space in between
    lines = []
    output = ""
    for word in summaryList:
        output += word + " "
        if len(output) > 100:
            lines.append(output)
            output = ""
    lines.append(output)

    for i, line in enumerate(lines):
        pdf.drawString(newX(0), newY(300+ i*50), line)
    pdf.save() #Saves the pdf in the same folder as the main.py file

def outputinConsole(title,link,summary):
    print("\nTitle: " + title)
    print("Link: " + link)
    print("Summary: " + summary[:300] + "...")

if __name__ == '__main__':

    search_term = "munich"

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

