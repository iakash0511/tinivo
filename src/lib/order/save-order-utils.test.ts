import test from 'node:test'
import assert from 'node:assert/strict'
import {
  createFallbackOrderId,
  getCanonicalOrderFields,
  isValidPaymentMethod,
  validateSaveOrderPayload,
  type SaveOrderPayload,
} from './save-order-utils.ts'

const basePayload: SaveOrderPayload = {
  paymentMethod: 'upi',
  cartItems: [{ _id: '1', name: 'A', price: 100, quantity: 1 }],
  totalAmount: 100,
  checkoutInfo: {
    fullName: 'User',
    phoneNumber: '9999999999',
    address: 'Street 123',
    city: 'City',
    pincode: '600001',
  },
}

test('validates payment methods', () => {
  assert.equal(isValidPaymentMethod('upi'), true)
  assert.equal(isValidPaymentMethod('card'), true)
  assert.equal(isValidPaymentMethod('cod'), true)
  assert.equal(isValidPaymentMethod('partial_cod'), false)
})

test('returns validation errors for malformed payloads', () => {
  assert.equal(validateSaveOrderPayload({ ...basePayload, paymentMethod: undefined }), 'Invalid payment method')
  assert.equal(validateSaveOrderPayload({ ...basePayload, cartItems: [] }), 'Cart items are required')
  assert.equal(validateSaveOrderPayload({ ...basePayload, totalAmount: 0 }), 'Invalid total amount')
  assert.equal(
    validateSaveOrderPayload({ ...basePayload, checkoutInfo: { ...basePayload.checkoutInfo!, city: '' } }),
    'Incomplete checkout info'
  )
})

test('accepts valid payloads', () => {
  assert.equal(validateSaveOrderPayload(basePayload), null)
})

test('creates fallback order id with expected prefix', () => {
  const oldRandom = Math.random
  Math.random = () => 0.123456789
  assert.match(createFallbackOrderId(1700000000000), /^TNV_1700000000000_[A-Z0-9]{6}$/)
  Math.random = oldRandom
})

test('uses provider ids when available', () => {
  const canonical = getCanonicalOrderFields({
    ...basePayload,
    paymentMethod: 'cod',
    paymentResponse: {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
    },
  })

  assert.equal(canonical.orderId, 'order_123')
  assert.equal(canonical.paymentId, 'pay_123')
  assert.equal(canonical.isCOD, true)
  assert.equal(canonical.paymentStatus, 'cod')
})
