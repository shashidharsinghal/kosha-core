# Payments & UPI Mandates

## Feature Description

Allow users to link UPI accounts and initiate bill payments, as well as create UPI mandates for recurring debits.

## Goals & Business Rules

* Users can securely link their UPI account via a provider.
* Initiate bill payment with one‑click using the linked UPI.
* Support mandates for recurring payments.
* Show confirmation, status and transaction history for each payment.
* Support integration with different banks and third‑party UPI gateways.

## Edge Cases & Notes

* Handle payment failure due to insufficient balance.
* Include retry and fallback logic for UPI status polling.
* Support split payments (e.g., paying with two UPI handles).
* Notify on due date if mandate fails.
* Ensure secure handling of UPI credentials and tokens.