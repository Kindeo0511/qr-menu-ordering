from ...models import TableOrders, Orders
from django.utils import timezone
today = timezone.localdate()
def create_orders(data):
    orders = data.pop('orders')
    table_order = TableOrders.objects.create(table=data['table'])
    table = table_order.table
    table.status = "Occupied"
    table.save(update_fields=["status"])
    for order in orders:
        Orders.objects.create(table_order=table_order, **order)
    return table_order

def show_all_orders():
    return TableOrders.objects.all()
def orders_today():
    return TableOrders.objects.filter(created_at__date=today).count()
def get_table_order(pk):
    return TableOrders.objects.get(id=pk)

def update_order_status(old_status, new_status):
    for field, value in new_status.items():
        setattr(old_status, field, value)
    old_status.save()
    return old_status

def count_pending_payments():
    return TableOrders.objects.filter(payment_status="Unpaid").count()


