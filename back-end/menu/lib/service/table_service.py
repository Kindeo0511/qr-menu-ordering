from ...models import Table
from io import BytesIO
from django.core.files.base import ContentFile
import qrcode

def create_qr_table(data):
    return Table.objects.create(**data)

def update_qr_table(old_table: Table, new_table: dict) -> Table:
    new_number = new_table.get('table_number')

    if new_number is not None and new_number != old_table.table_number:
        # Check the new number isn't already taken by another table
        if Table.objects.filter(table_number=new_number).exclude(pk=old_table.pk).exists():
            raise ValueError(f'Table number {new_number} is already in use.')

        old_table.table_number = new_number

        # Regenerate QR code to point at the new table number
        qr_payload = f'http://localhost:5173/{old_table.table_number}/'

        qr = qrcode.QRCode()
        qr.add_data(qr_payload)
        qr.make(fit=True)
        img = qr.make_image()

        buffer = BytesIO()
        img.save(buffer, format='PNG')

        # Delete the old QR image file so it doesn't linger as an orphan
        if old_table.qr_image_url:
            old_table.qr_image_url.delete(save=False)

        old_table.qr_data = qr_payload
        old_table.qr_image_url.save(
            f'qr_{old_table.table_number}.png',
            ContentFile(buffer.getvalue()),
            save=False,
        )


    old_table.save()
    return old_table

def get_all_qr_table():
    return Table.objects.all()

def delete_qr_table(data):
    data.delete()

def get_qr_table(number):
    return Table.objects.get(table_number=number)


def count_available_tables():
    return Table.objects.filter(status="Available").count()

def count_unavailable_tables():
    return Table.objects.filter(status="Occupied").count()
    