from flask import Flask
from flask import request

app=Flask(__name__)

@app.route('/',methods=["GET","POST"])
def home():
	return 'Home'

@app.route('/signin',methods=["GET"])
def signin_form():
	return render_template('index.html')

if __name__=='__main__':
	app.run()