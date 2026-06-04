#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def NewX(x):
    newX = x + 150     # Feature 2
    return newX

def NewY(y):
    height = 3508
    newY = height - y - 250     # Feature 2
    return newY

def createPDF(title, link, summary):

    # copilot is not very poetic:
    # <prompt:> a cat poem about generating a pdf:
    # roses are red, violets are blue
    # this poem is not, but the pdf is

    # create a new pdf with the title as name

    pdf = canvas.Canvas(title+".pdf")
    pdf.setPageSize((2480 ,3508))
    pdf.setFont("Helvetica", 40)

    ### write the 'title' string to position (0, 0) on the page
    pdf.drawString(NewX(0), NewY(0), title)

    # draw the link at (0, 100)
    pdf.drawString(NewX(0), NewY(100), link)

    # split summary into words
    ypos = 200
    line_height = 50

    words = summary.split(" ")
    line = ""
    for w in words:
        # copilots solution does not sound too bad:
        # if pdf.stringWidth(line + w) < 2480:
        if len(line) + len(w) <= 100:
            line += w + " "
        else:
            pdf.drawString(NewX(0), NewY(ypos), line)
            # get height of one line of text
            ypos += line_height
            line = w + " "
    pdf.drawString(NewX(0), NewY(ypos), line)
    # draw the summary at (0, 200)
    #pdf.drawString(NewX(0), NewY(200), summary)

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

