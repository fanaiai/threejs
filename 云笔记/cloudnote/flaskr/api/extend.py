import functools

from flask import(Blueprint,flash,g,redirect,render_template,request,session,url_for)
from werkzeug.security import check_password_hash,generate_password_hash
# from flask.db import get_db
bp = Blueprint('extend',__name__,url_prefix='/extend')

@bp.route('/',methods=('GET','POST'))
def register():
	if request.method=='GET':
		return render_template('extend/index.html')