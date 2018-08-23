import functools

from flask import(Blueprint,flash,g,redirect,render_template,request,session,url_for)
from werkzeug.security import check_password_hash,generate_password_hash
# from flask.db import get_db
bp = Blueprint('auth',__name__,url_prefix='/auth')

@bp.route('/register',methods=('GET','POST'))
def register():
	if request.method=='GET':
		return render_template('index.html')