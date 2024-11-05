from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def mainPage():  # put application's code here
    return render_template('mainPage.html')


if __name__ == '__main__':
    app.run()
