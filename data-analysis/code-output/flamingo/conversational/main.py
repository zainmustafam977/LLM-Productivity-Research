#Wikipedia Downloader Task
from reportlab.pdfgen import canvas
import wikipedia
import warnings
warnings.catch_warnings()
warnings.simplefilter("ignore")

def newX(x):
    newX = x  + 150    # Feature 2
    return newX

def newY(y):
    height = 3508
    newY = height - y - 250   # Feature 2
    return newY


def createPDF(title, link, summary):
    pdf = canvas.Canvas(title + ".pdf")
    pdf.setPageSize((2480, 3508))
    pdf.setFont("Helvetica", 40)

    # Write the title
    title_x = newX(100)  # Move 100 pixels to the right
    title_y = newY(3200)  # Invert and move down by 250 pixels
    pdf.drawString(title_x, title_y, "Title: " + title)

    # Write the link
    link_x = newX(100)  # Move 100 pixels to the right
    link_y = newY(3000)  # Invert and move down by 250 pixels
    pdf.drawString(link_x, link_y, "Link: " + link)

    # Write the summary
    summary_x = newX(100)  # Move 100 pixels to the right
    summary_y = newY(2700)  # Invert and move down by 250 pixels
    pdf.drawString(summary_x, summary_y, "Summary: " + summary)
    y = summary_y - 100
    for line in summary[:300].split("\n"):
        pdf.drawString(summary_x + 100, y, line)
        y -= 50

    pdf.save()  # Saves the pdf in the same folder as the main.py file


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

