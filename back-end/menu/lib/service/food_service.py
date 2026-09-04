from ...models import FoodMenu

def create_food(data):
    return FoodMenu.objects.create(**data)

def update_food(old_data, new_data):
    for field, value in new_data.items():
        setattr(old_data, field, value)
    old_data.save()
    return old_data

def delete_food(data):
    data.delete()

def get_food(pk):
    return FoodMenu.objects.get(id=pk)

def get_all_food():
    return FoodMenu.objects.all()