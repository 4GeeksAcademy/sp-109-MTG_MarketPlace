import os
from flask import Blueprint, jsonify, request, current_app
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment, LiveEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from api.models import db, Carrito  # o tu modelo Order

bp = Blueprint("orders_paypal", __name__)

# Inicializa cliente SDK
env = SandboxEnvironment(
    client_id=os.getenv("PAYPAL_CLIENT_ID"),
    client_secret=os.getenv("PAYPAL_CLIENT_SECRET")
) if os.getenv("FLASK_DEBUG") == "1" else LiveEnvironment(
    client_id=os.getenv("PAYPAL_CLIENT_ID"),
    client_secret=os.getenv("PAYPAL_CLIENT_SECRET")
)
paypal_client = PayPalHttpClient(env)

@bp.route("/create", methods=["POST"])
def create_order():
    data = request.get_json()
    carrito_id = data.get("carritoId")
    importe = data.get("amount")

    if not carrito_id or importe is None:
        return jsonify({"error": "Missing carritoId or amount"}), 400

    # Opcional: validar que el carrito existe y importe coincida
    carrito = Carrito.query.get(carrito_id)
    if not carrito:
        return jsonify({"error": "Carrito no encontrado"}), 404

    request_order = OrdersCreateRequest()
    request_order.prefer("return=representation")
    request_order.request_body({
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": str(carrito_id),
            "amount": {
                "currency_code": "EUR",
                "value": f"{importe:.2f}"
            }
        }],
        "application_context": {
            "brand_name": "MTG Marketplace",
            "user_action": "PAY_NOW",
            "return_url": f"{request.host_url}api/orders_paypal/capture?carritoId={carrito_id}",
            "cancel_url": f"{request.host_url}checkout/{carrito_id}?cancel=true"
        }
    })

    try:
        response = paypal_client.execute(request_order)
        return jsonify({"orderID": response.result.id}), 201
    except Exception as e:
        current_app.logger.error("PayPal create_order error: %s", e)
        return jsonify({"error": "No se pudo crear la orden"}), 500

@bp.route("/capture", methods=["POST", "GET"])
def capture_order():
    # Si se hace POST desde frontend o callback GET
    body = request.get_json() or request.args
    order_id = body.get("orderID")
    carrito_id = body.get("carritoId") or body.get("carritoId")

    if not order_id or not carrito_id:
        return jsonify({"error": "Missing orderID o carritoId"}), 400

    request_capture = OrdersCaptureRequest(order_id)
    request_capture.request_body({})

    try:
        resp = paypal_client.execute(request_capture)
        capture_id = resp.result.purchase_units[0].payments.captures[0].id

        # TODO: actualizar estado del carrito en BD
        carrito = Carrito.query.get(carrito_id)
        carrito.status = "pagado"
        db.session.commit()

        return jsonify({"status": "COMPLETED", "captureID": capture_id}), 200
    except Exception as e:
        current_app.logger.error("PayPal capture_order: %s", e)
        return jsonify({"error": "Error al capturar el pago"}), 500
