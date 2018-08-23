from flask import Flask
from flask import request

app=Flask(__name__)

@app.route('/',methods=["GET","POST"])
def home():
	name=request.args.get('name','')
	return name

@app.route('/signin',methods=["GET"])
def signin_form():
	return render_template('index.html')