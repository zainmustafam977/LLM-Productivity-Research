#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x     # Feature 2
    return newX

def newY(y):
    height = 3508
    newY = y     # Feature 2
    return newY

def createPDF(title, link, summary):

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    # Feature 1, Feature 2, Feature 3
    #As the first step of the PDF generation, draw the title, link, and summary into the PDF.
    pdf.drawString(newX(0), newY(0), title)
    pdf.drawString(newX(0), newY(100), link)
    pdf.drawString(newX(0), newY(200), summary)


    #As seen in the expected output of the previous feature, the placement of the text in the PDF is unusual. This is because the coordinate system of the pdfgen library defines x=0 and y=0 as the bottom left corner and does not include any padding to the edges of the document. This should be improved by adapting the functions NewX and NewY.



    pdf.drawString(newX(150), newY(250), title)
    pdf.drawString(newX(150), newY(350), link)

    #The text drawing function draws the summary text in one horizontal line which overflows the page. Adapt the drawing of the summary as follows so its draws the text over multiple lines without breaking words apart.


    words = summary.split(" ")
    line = ""
    y = 450
    for word in words:
        if len(line) + len(word) > 100:
            pdf.drawString(newX(150), newY(y), line)
            y += 50
            line = ""
        line += word + " "
    pdf.drawString(newX(150), newY(y), line)




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

