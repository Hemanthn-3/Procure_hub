from flask import request, jsonify

from src.models.PurchaseOrder import PurchaseOrder
from src.models.Bid import Bid
from src.utils.validators import validate_po


def create_po():
    """
    POST /api/v1/procurement/po
    Create a new purchase order (Manager only).
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Request body is required."}), 400

        # Validate request body
        errors = validate_po(data)
        if errors:
            return jsonify({"errors": errors}), 400

        item_description = data["item_description"].strip()
        quantity = int(data["quantity"])
        target_delivery_date = data["target_delivery_date"]

        # Create PO with manager_id from authenticated user
        po = PurchaseOrder.create(
            manager_id=request.user["id"],
            item_description=item_description,
            quantity=quantity,
            target_delivery_date=target_delivery_date,
        )

        return jsonify({"message": "Purchase order created successfully.", "purchase_order": po}), 201

    except Exception as e:
        print(f"Create PO error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def get_my_pos():
    """
    GET /api/v1/procurement/po
    List all POs for the logged-in manager.
    """
    try:
        purchase_orders = PurchaseOrder.find_by_manager_id(request.user["id"])
        return jsonify({"purchase_orders": purchase_orders})

    except Exception as e:
        print(f"Get POs error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def get_bids_for_po(po_id):
    """
    GET /api/v1/procurement/po/<po_id>/bids
    Get all bids for a specific PO (Manager only).
    """
    try:
        # Verify the PO belongs to this manager
        po = PurchaseOrder.find_by_id(po_id)
        if not po:
            return jsonify({"error": "Purchase order not found."}), 404
        if po["manager_id"] != request.user["id"]:
            return jsonify({"error": "You can only view bids for your own purchase orders."}), 403

        bids = Bid.find_by_po_id(po_id)
        return jsonify({"purchase_order": po, "bids": bids})

    except Exception as e:
        print(f"Get bids error: {e}")
        return jsonify({"error": "Internal server error."}), 500


def accept_bid(bid_id):
    """
    PUT /api/v1/procurement/bids/<bid_id>/accept
    Accept a bid — sets bid to 'accepted', PO to 'awarded', rejects others.
    """
    try:
        # Find the bid
        bid = Bid.find_by_id(bid_id)
        if not bid:
            return jsonify({"error": "Bid not found."}), 404

        # Verify the PO belongs to this manager
        po = PurchaseOrder.find_by_id(bid["po_id"])
        if not po or po["manager_id"] != request.user["id"]:
            return jsonify({"error": "You can only accept bids for your own purchase orders."}), 403

        if po["status"] == "awarded":
            return jsonify({"error": "This purchase order has already been awarded."}), 400

        # Accept the bid
        Bid.update_status(bid_id, "accepted")

        # Reject all other bids for this PO
        Bid.reject_other_bids(bid["po_id"], bid_id)

        # Update PO status to 'awarded'
        PurchaseOrder.update_status(bid["po_id"], "awarded")

        return jsonify({"message": "Bid accepted. Purchase order awarded."})

    except Exception as e:
        print(f"Accept bid error: {e}")
        return jsonify({"error": "Internal server error."}), 500
