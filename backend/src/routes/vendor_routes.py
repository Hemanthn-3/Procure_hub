from flask import Blueprint
from src.middleware.auth_middleware import auth_required
from src.middleware.role_middleware import require_role
from src.controllers.vendor_controller import (
    get_marketplace,
    submit_bid,
    get_my_bids,
)

vendor_bp = Blueprint("vendor", __name__, url_prefix="/api/v1/vendor")


# GET /api/v1/vendor/marketplace — Browse open tenders
@vendor_bp.route("/marketplace", methods=["GET"])
@auth_required
@require_role("vendor")
def _get_marketplace():
    return get_marketplace()


# POST /api/v1/vendor/bids/submit — Submit a bid
@vendor_bp.route("/bids/submit", methods=["POST"])
@auth_required
@require_role("vendor")
def _submit_bid():
    return submit_bid()


# GET /api/v1/vendor/bids — View vendor's submitted bids
@vendor_bp.route("/bids", methods=["GET"])
@auth_required
@require_role("vendor")
def _get_my_bids():
    return get_my_bids()
