from ...models import Orders

def create_food_order(data):
    order = Orders.objects.create(**data)
    table = order.table_order.table
    table.status = "Occupied"
    table.save(update_fields=["status"])
    return order
   

def show_all_food_order():
    return Orders.objects.all()

def get_food_order(pk):
    return Orders.objects.get(id=pk)
