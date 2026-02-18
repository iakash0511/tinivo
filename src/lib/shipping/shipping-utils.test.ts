import test from 'node:test'
import assert from 'node:assert/strict'
import { clampPackageMetrics, extractShiprocketToken } from './shipping-utils.ts'

test('clamps package metrics to safe minimums', () => {
  assert.deepEqual(clampPackageMetrics({ weight: 0, length: 0, breadth: undefined, height: null }), {
    safeWeight: 0.5,
    safeLength: 10,
    safeBreadth: 10,
    safeHeight: 5,
  })

  assert.deepEqual(clampPackageMetrics({ weight: 1.2, length: 20, breadth: 15, height: 7 }), {
    safeWeight: 1.2,
    safeLength: 20,
    safeBreadth: 15,
    safeHeight: 7,
  })
})

test('extracts token from known shiprocket response shapes', () => {
  assert.equal(extractShiprocketToken({ token: 'root-token' }), 'root-token')
  assert.equal(extractShiprocketToken({ data: { token: 'data-token' } }), 'data-token')
  assert.equal(extractShiprocketToken({ token_id: 'legacy-token' }), 'legacy-token')
  assert.equal(extractShiprocketToken({}), undefined)
})
