import os
from flask import Blueprint, request, jsonify
import stripe

api = Blueprint('api', __name__)

stripe.api_key = os.getenv("sk_test_51RvX6vCkzmZfDO8BfZJ9zaGJBtcddFLEkTFhCnGJeYiggvMIZVqXiIEdSDNiL9nZFTlVeQzJJPtOywZ7syURXCQH00as7zw99d") 

@api.route('/stripe/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    carrito_id = data.get('carritoId')

    if not carrito_id:
        return jsonify({"message": "Falta carritoId"}), 400

    total_amount = 2000 

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': f'Compra carrito {carrito_id}',
                    },
                    'unit_amount': total_amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'https://tu-frontend.com/checkout/success?session_id={{CHECKOUT_SESSION_ID}}',
            cancel_url='https://tu-frontend.com/checkout/cancel',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify(error=str(e)), 500
