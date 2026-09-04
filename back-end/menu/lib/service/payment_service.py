from ...models import Payment
from django.utils import timezone
today = timezone.localdate()

def process_payment(data):
    payment = Payment.objects.create(**data)
    table_order = payment.table_order
    table = table_order.table

    table.status = "Available"
    table.save(update_fields=["status"])

    table_order.payment_status = "Paid"
    table_order.save(update_fields=["payment_status"])

    return payment

def show_all_payment():
    return Payment.objects.all()

def get_payment_by_id(pk):
    return Payment.objects.get(id=pk)

def count_revenue_today():
    return Payment.objects.filter(created_at__date=today).count()

