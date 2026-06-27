import datetime
from decimal import Decimal
from src.config.db import get_connection


class Bid:
    """Bid model — maps to the bids table."""

    @staticmethod
    def create(po_id, vendor_id, bid_amount, promised_delivery_days):
        """Create a new bid with status 'submitted'."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "INSERT INTO bids (po_id, vendor_id, bid_amount, promised_delivery_days, status) "
                "VALUES (%s, %s, %s, %s, 'submitted')",
                (po_id, vendor_id, bid_amount, promised_delivery_days),
            )
            conn.commit()
            bid_id = cursor.lastrowid
            return {
                "id": bid_id,
                "po_id": po_id,
                "vendor_id": vendor_id,
                "bid_amount": float(bid_amount),
                "promised_delivery_days": promised_delivery_days,
                "status": "submitted",
            }
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_po_id(po_id):
        """Find all bids for a specific PO, ordered by bid amount ascending."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT b.*, u.company_name AS vendor_company, u.email AS vendor_email "
                "FROM bids b "
                "JOIN users u ON b.vendor_id = u.id "
                "WHERE b.po_id = %s "
                "ORDER BY b.bid_amount ASC",
                (po_id,),
            )
            rows = cursor.fetchall()
            for row in rows:
                _serialize_row(row)
            return rows
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_vendor_id(vendor_id):
        """Find all bids by a specific vendor with PO details."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT b.*, po.item_description, po.quantity, po.target_delivery_date, "
                "po.status AS po_status, u.company_name AS manager_company "
                "FROM bids b "
                "JOIN purchase_orders po ON b.po_id = po.id "
                "JOIN users u ON po.manager_id = u.id "
                "WHERE b.vendor_id = %s "
                "ORDER BY b.created_at DESC",
                (vendor_id,),
            )
            rows = cursor.fetchall()
            for row in rows:
                _serialize_row(row)
            return rows
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_id(bid_id):
        """Find a bid by ID."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM bids WHERE id = %s", (bid_id,))
            row = cursor.fetchone()
            if row:
                _serialize_row(row)
            return row
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def update_status(bid_id, status):
        """Update bid status."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "UPDATE bids SET status = %s WHERE id = %s",
                (status, bid_id),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def reject_other_bids(po_id, accepted_bid_id):
        """Reject all other submitted bids for a PO when one is accepted."""
        conn = get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(
                "UPDATE bids SET status = 'rejected' "
                "WHERE po_id = %s AND id != %s AND status = 'submitted'",
                (po_id, accepted_bid_id),
            )
            conn.commit()
        finally:
            cursor.close()
            conn.close()

    @staticmethod
    def find_by_po_and_vendor(po_id, vendor_id):
        """Check if a vendor has already bid on a PO."""
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute(
                "SELECT * FROM bids WHERE po_id = %s AND vendor_id = %s",
                (po_id, vendor_id),
            )
            return cursor.fetchone()
        finally:
            cursor.close()
            conn.close()


def _serialize_row(row):
    """Convert non-serializable types in a dict for JSON output."""
    for key, value in row.items():
        if isinstance(value, (datetime.date, datetime.datetime)):
            row[key] = value.isoformat()
        elif isinstance(value, Decimal):
            row[key] = float(value)
