from users.models import UserModel

def create_user(data):
    return UserModel.objects.create_user(**data)
def update_user(user, data):
    password = data.pop('password', None)

    if password:
        user.set_password(password)
        
    for field, value in data.items():
        setattr(user, field, value)

    user.save()
    return user

def delete_user(user):
     user.delete()

def current_user(username):
    return UserModel.objects.get(username=username)

def get_all_user():
       return UserModel.objects.all()

def get_user_by_id(pk):
     return UserModel.objects.get(id=pk)
