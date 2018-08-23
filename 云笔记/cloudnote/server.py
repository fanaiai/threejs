from flaskr import create_app
from os import path

# extra_dirs=['/',]
# extra_files=extra_dirs[:]
# for extra_dir in extra_dirs:
#     for dirname, dirs, files in os.walk(extra_dir):
#         for filename in files:
#             filename = path.join(dirname, filename)
#             if path.isfile(filename):
#                 extra_files.append(filename)

app=create_app()
app.config['TEMPLATES_AUTO_RELOAD'] = True #自动刷新模板
app.run(port='8099')