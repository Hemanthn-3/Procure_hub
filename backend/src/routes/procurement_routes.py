from flask import Blueprint
from src.middleware.auth_middleware import auth_required
from src.middleware.role_middleware import require_role
from src.controllers.procurement_controller import (
    create_po,
    get_my_pos,
    get_bids_for_po,
    accept_bid,
)

procurement_bp = Blueprint("procurement", __name__, url_prefix="/api/v1/procurement")


# POST /api/v1/procurement/po — Create a new purchase order
@procurement_bp.route("/po", methods=["POST"])
@auth_required
@require_role("procurement_manager")
def _create_po():
    return create_po()


# GET /api/v1/procurement/po — List manager's purchase orders
@procurement_bp.route("/po", methods=["GET"])
@auth_required
@require_role("procurement_manager")
def _get_my_pos():
    return get_my_pos()


# GET /api/v1/procurement/po/<po_id>/bids — View bids for a PO
@procurement_bp.route("/po/<int:po_id>/bids", methods=["GET"])
@auth_required
@require_role("procurement_manager")
def _get_bids_for_po(po_id):
    return get_bids_for_po(po_id)


# PUT /api/v1/procurement/bids/<bid_id>/accept — Accept a bid
@procurement_bp.route("/bids/<int:bid_id>/accept", methods=["PUT"])
@auth_required
@require_role("procurement_manager")
def _accept_bid(bid_id):
    return accept_bid(bid_id)
