"""Request body validation helpers."""

import re


def validate_signup(data):
    """Validate signup request body."""
    errors = []

    email = data.get("email")
    password = data.get("password")
    company_name = data.get("company_name")
    role = data.get("role")

    if not email or not isinstance(email, str) or "@" not in email:
        errors.append("Valid email is required.")

    if not password or not isinstance(password, str) or len(password) < 6:
        errors.append("Password must be at least 6 characters.")

    if not company_name or not isinstance(company_name, str) or not company_name.strip():
        errors.append("Company name is required.")

    valid_roles = ["procurement_manager", "vendor"]
    if not role or role not in valid_roles:
        errors.append('Role must be "procurement_manager" or "vendor".')

    return errors


def validate_login(data):
    """Validate login request body."""
    errors = []

    if not data.get("email") or not isinstance(data.get("email"), str):
        errors.append("Email is required.")

    if not data.get("password") or not isinstance(data.get("password"), str):
        errors.append("Password is required.")

    return errors


def validate_po(data):
    """Validate purchase order creation."""
    errors = []

    item_description = data.get("item_description")
    quantity = data.get("quantity")
    target_delivery_date = data.get("target_delivery_date")

    if not item_description or not isinstance(item_description, str) or not item_description.strip():
        errors.append("Item description is required.")

    try:
        qty = int(quantity)
        if qty <= 0:
            raise ValueError
    except (TypeError, ValueError):
        errors.append("Quantity must be a positive integer.")

    if not target_delivery_date or not isinstance(target_delivery_date, str):
        errors.append("Target delivery date is required (YYYY-MM-DD).")
    elif not re.match(r"^\d{4}-\d{2}-\d{2}$", target_delivery_date):
        errors.append("Target delivery date must be in YYYY-MM-DD format.")

    return errors


def validate_bid(data):
    """Validate bid submission."""
    errors = []

    po_id = data.get("po_id")
    bid_amount = data.get("bid_amount")
    promised_delivery_days = data.get("promised_delivery_days")

    try:
        pid = int(po_id)
        if pid <= 0:
            raise ValueError
    except (TypeError, ValueError):
        errors.append("Valid purchase order ID (po_id) is required.")

    try:
        amount = float(bid_amount)
        if amount <= 0:
            raise ValueError
    except (TypeError, ValueError):
        errors.append("Bid amount must be a positive number.")

    try:
        days = int(promised_delivery_days)
        if days <= 0:
            raise ValueError
    except (TypeError, ValueError):
        errors.append("Promised delivery days must be a positive integer.")

    return errors
