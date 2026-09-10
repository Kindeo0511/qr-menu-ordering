from users.models import UserModel

def create_user(data):
    password = data.pop('password', None)
    user = UserModel.objects.create_superuser(password=password,**data)
    return user

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

def get_all_user(user):
    if user.role == "ST":        
       return UserModel.objects.exclude(username=user.username).exclude(role="AD")
    
    return UserModel.objects.exclude(username=user.username)

def get_user_by_id(pk):
     return UserModel.objects.get(id=pk)

def get_user_profile_by_username(username):
     return UserModel.objects.get(username=username)
