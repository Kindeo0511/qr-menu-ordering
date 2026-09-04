from ...models import CategoryMenu
from django_filters.rest_framework import DjangoFilterBackend

def create_category(data):
    return CategoryMenu.objects.create(**data)

def update_category(old_data, new_data):

    for field, value in new_data.items():
        setattr(old_data, field, value)
    old_data.save()
    return old_data

def delete_category(data):
    data.delete()

def get_category_by_id(id):
    return CategoryMenu.objects.get(pk=id)

def get_all_category(category_name):
    if category_name:
        return CategoryMenu.objects.filter(name=category_name)
    return CategoryMenu.objects.all()
