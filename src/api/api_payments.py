# src/api/api_payments.py
import os
from flask import Blueprint, request, jsonify
import stripe
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from paypalcheckoutsdk.core import SandboxEnvironment, PayPalHttpClient

api = Blueprint("api_payments", __name__)

# -------------------------------
# Stripe Configuración
# -------------------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # sk_test_...

# -------------------------------
# PayPal Configuración
# -------------------------------
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
paypal_env = SandboxEnvironment(client_id=PAYPAL_CLIENT_ID, client_secret=PAYPAL_CLIENT_SECRET)
paypal_client = PayPalHttpClient(paypal_env)

# -------------------------------
# Stripe - Crear sesión Checkout
# -------------------------------
@api.route("/stripe/create-checkout-session", methods=["POST"])
def create_stripe_session():
    try:
        data = request.get_json()
        carrito_id = data.get("carritoId")
        if not carrito_id:
            return jsonify({"message": "Falta carritoId"}), 400

        # Importe de prueba (céntimos)
        total_amount = 2000  # 20€

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "eur",
                    "product_data": {"name": f"Compra carrito {carrito_id}"},
                    "unit_amount": total_amount,
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=f"{os.getenv('FRONTEND_URL')}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL')}/checkout/cancel",
        )
        return jsonify({"sessionId": session.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# PayPal - Crear orden
# -------------------------------
@api.route("/orders_paypal/create", methods=["POST"])
def create_paypal_order():
    try:
        data = request.get_json()
        carrito_id = data.get("carritoId")
        amount = data.get("amount", 20)
        if not carrito_id:
            return jsonify({"message": "Falta carritoId"}), 400

        request_order = OrdersCreateRequest()
        request_order.prefer("return=representation")
        request_order.request_body(
            {
                "intent": "CAPTURE",
                "purchase_units": [
                    {
                        "reference_id": str(carrito_id),
                        "amount": {"currency_code": "EUR", "value": f"{amount:.2f}"}
                    }
                ]
            }
        )

        response = paypal_client.execute(request_order)
        return jsonify({"orderID": response.result.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# PayPal - Capturar orden
# -------------------------------
@api.route("/orders_paypal/capture", methods=["POST"])
def capture_paypal_order():
    try:
        data = request.get_json()
        order_id = data.get("orderID")
        carrito_id = data.get("carritoId")
        if not order_id or not carrito_id:
            return jsonify({"message": "Falta orderID o carritoId"}), 400

        request_capture = OrdersCaptureRequest(order_id)
        request_capture.prefer("return=representation")
        response = paypal_client.execute(request_capture)

        if response.result.status == "COMPLETED":
            capture_id = response.result.purchase_units[0].payments.captures[0].id
            return jsonify({"status": "COMPLETED", "captureID": capture_id})
        else:
            return jsonify({"status": response.result.status})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
