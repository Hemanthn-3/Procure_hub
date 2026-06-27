from src.config.db import get_connection


class PurchaseOrder:
    """PurchaseOrder model — maps to the purchase_orders table."""

    @staticmethod
    def create(manager_id, item_description, quantity, target_delivery_date):
        """Create a new purchase order with status 'open_for_bids'."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO purchase_orders "
                "(manager_id, item_description, quantity, target_delivery_date, status) "
                "VALUES (%s, %s, %s, %s, 'open_for_bids')",
                (manager_id, item_description, quantity, target_delivery_date),
            )
            conn.commit()
            po_id = cursor.lastrowid
            return {
                "id": po_id,
                "manager_id": manager_id,
                "item_description": item_description,
                "quantity": quantity,
                "target_delivery_date": str(target_delivery_date),
                "status": "open_for_bids",
            }
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_manager_id(manager_id):
        """Find all POs by a specific manager, including bid count."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT po.*, "
                "(SELECT COUNT(*) FROM bids WHERE bids.po_id = po.id) AS bid_count "
                "FROM purchase_orders po "
                "WHERE po.manager_id = %s "
                "ORDER BY po.created_at DESC",
                (manager_id,),
            )
            rows = cursor.fetchall()
            # Convert date/datetime objects to strings for JSON serialization
            for row in rows:
                _serialize_row(row)
            return rows
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_open_for_bids():
        """Find all POs that are open for bids (vendor marketplace)."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT po.*, u.company_name AS company "
                "FROM purchase_orders po "
                "JOIN users u ON po.manager_id = u.id "
                "WHERE po.status = 'open_for_bids' "
                "ORDER BY po.created_at DESC"
            )
            rows = cursor.fetchall()
            for row in rows:
                _serialize_row(row)
            return rows
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_id(po_id):
        """Find a PO by ID."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT po.*, u.company_name AS company "
                "FROM purchase_orders po "
                "JOIN users u ON po.manager_id = u.id "
                "WHERE po.id = %s",
                (po_id,),
            )
            row = cursor.fetchone()
            if row:
                _serialize_row(row)
            return row
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def update_status(po_id, status):
        """Update PO status."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "UPDATE purchase_orders SET status = %s WHERE id = %s",
                (status, po_id),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()


def _serialize_row(row):
    """Convert date/datetime objects in a dict to ISO format strings."""
    import datetime

    for key, value in row.items():
        if isinstance(value, (datetime.date, datetime.datetime)):
            row[key] = value.isoformat()
