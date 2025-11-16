# Authentication & User Management

## Feature Description

This module allows users to securely register, log in, and manage their identity within the Kosha platform.  It also allows linking external accounts such as Gmail for bill scanning.

## Goals & Business Rules

* Only verified users can access the app.
* Users must register with a valid email address.
* User data must be stored securely (hashed passwords).
* Each user can link only one Gmail account for bill scanning.
* Should support refresh tokens and session expiration securely.
* Support for passwordless login (OTP or magic link) in future versions.
* Support deleting a user and associated data securely.

## Edge Cases & Notes

* Block registration with duplicate emails.
* Handle expired Gmail tokens.
* Retry Gmail auth on network failures.
* Consider future social login (Google, Apple ID).
* Ensure logout invalidates refresh tokens.
* Provide option to unlink Gmail and clear associated metadata.