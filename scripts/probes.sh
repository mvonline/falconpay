#!/bin/bash

# FalconPay Synthetic Business Probe
# Purpose: Simulate a live user transaction to verify system-wide business integrity.

BASE_URL="http://localhost:3000"
PROBE_USER="probe@falconpay.om"
PROBE_PASS="ProbePass123!"

echo "🕒 Starting Synthetic Probe: $(date)"

# 1. Login
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$PROBE_USER\", \"password\": \"$PROBE_PASS\"}" | jq -r '.accessToken')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ FAIL: Authentication probe failed."
  exit 1
fi

echo "✅ Auth Probe Success."

# 2. Check Balance
BALANCE=$(curl -s -X GET "$BASE_URL/wallets/balance" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.balance')

echo "✅ Current Balance: $BALANCE OMR"

# 3. Simulate Tiny Transfer
RECEIVER_ID="00000000-0000-0000-0000-000000000000"
TX_ID=$(curl -s -X POST "$BASE_URL/payments/transfer" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"receiverId\": \"$RECEIVER_ID\", \"amount\": 0.001, \"description\": \"Synthetic Probe\"}" | jq -r '.id')

if [ "$TX_ID" == "null" ] || [ -z "$TX_ID" ]; then
  echo "❌ FAIL: Payment creation probe failed."
  exit 1
fi

echo "✅ Payment Initiated: $TX_ID"

# 4. Wait for Saga completion
sleep 2

# 5. Verify Transaction Status
STATUS=$(curl -s -X GET "$BASE_URL/payments/$TX_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.status')

if [ "$STATUS" == "COMPLETED" ]; then
  echo "🏆 SUCCESS: Full Distributed Saga Probe Successful!"
else
  echo "⚠️ WARNING: Probe transaction is $STATUS. Investigate latency or saga failure."
fi
