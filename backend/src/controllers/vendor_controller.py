from flask import request, jsonify

from src.models.PurchaseOrder import PurchaseOrder
from src.models.Bid import Bid
from src.utils.validators import validate_bid


def get_marketplace():
    """
    GET /api/v1/vendor/marketplace
    Browse all open tenders (status = 'open_for_bids').
    """
    try:
        purchase_orders = PurchaseOrder.find_open_for_bids()
        return jsonify({"purchase_orders": purchase_orders})

    except Exception as e:
        print(f"Marketplace error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def submit_bid():
    """
    POST /api/v1/vendor/bids/submit
    Submit a bid on an open purchase order.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required."}), 400

        # Validate request body
        errors = validate_bid(data)
        if errors:
            return jsonify({"errors": errors}), 400

        po_id = int(data["po_id"])
        bid_amount = float(data["bid_amount"])
        promised_delivery_days = int(data["promised_delivery_days"])
        vendor_id = request.user["id"]

        # Check if PO exists and is open for bids
        po = PurchaseOrder.find_by_id(po_id)
        if not po:
            return jsonify({"error": "Purchase order not found."}), 404
        if po["status"] != "open_for_bids":
            return jsonify({"error": "This purchase order is no longer accepting bids."}), 400

        # Check if vendor has already submitted a bid for this PO
        existing_bid = Bid.find_by_po_and_vendor(po_id, vendor_id)
        if existing_bid:
            return jsonify({"error": "You have already submitted a bid for this purchase order."}), 409

        # Create the bid
        bid = Bid.create(
            po_id=po_id,
            vendor_id=vendor_id,
            bid_amount=bid_amount,
            promised_delivery_days=promised_delivery_days,
        )

        return jsonify({"message": "Bid submitted successfully.", "bid": bid}), 201

    except Exception as e:
        print(f"Submit bid error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def get_my_bids():
    """
    GET /api/v1/vendor/bids
    Get all bids submitted by the logged-in vendor.
    """
    try:
        bids = Bid.find_by_vendor_id(request.user["id"])
        return jsonify({"bids": bids})

    except Exception as e:
        print(f"Get vendor bids error: {e}")
        return jsonify({"error": "Internal server error."}), 500
