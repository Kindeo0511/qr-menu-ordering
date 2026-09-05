from ...models import Payment
from django.utils import timezone
from django.db.models import Sum
from datetime import timedelta
today = timezone.localdate()

def process_payment(data):
    if isinstance(data, Payment):
        payment = data  
    else:
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

def get_weekly_revenue_trend():
    now = timezone.now()
    start_of_week = (now - timedelta(days=now.weekday())).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    day_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    trend = []

    for i, label in enumerate(day_labels):
        day_start = start_of_week + timedelta(days=i)
        day_end = day_start + timedelta(days=1)

        total = Payment.objects.filter(
            created_at__gte=day_start,
            created_at__lt=day_end,
        ).aggregate(total=Sum("total_amount"))["total"] or 0

        trend.append({"day": label, "revenue": float(total)})

    return trend

