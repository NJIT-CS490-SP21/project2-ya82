from app import db
import models
db.create_all()

for item in models.Person.query.all():
    print(item.username)