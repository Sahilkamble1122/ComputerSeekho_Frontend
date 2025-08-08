# Payment Logic Implementation

## Overview
This implementation handles the payment processing logic where:
1. When a payment is made, the Receipt table stores the payment amount
2. The Student table's `pendingFees` field is updated to (original pending fees minus the amount paid)

## Key Components

### 1. Payment Processing API (`/api/payments/process`)
- **Location**: `app/api/payments/process/route.js`
- **Function**: Handles payment processing with the following steps:
  1. Validates payment amount against current pending fees
  2. Processes payment through the backend API
  3. Updates student's pending fees (pendingFees = pendingFees - amount)
  4. Creates receipt record with payment details

### 2. Payment History API (`/api/payments/history`)
- **Location**: `app/api/payments/history/route.js`
- **Function**: Fetches payment history and receipt data for a specific student

### 3. Updated Registration Form
- **Location**: `app/admin/enquiries/closure/[id]/registration/page.jsx`
- **New Features**:
  - Optional initial payment during registration
  - Payment type selection
  - Payment amount input with automatic pending fees calculation
  - Payment date selection

### 4. Updated Payment Pages
- **New Payment Page**: `app/admin/payments/[studentId]/new-payment/page.jsx`
  - Now uses the new payment processing API
  - Includes proper authentication
  - Updates UI with new pending fees after payment

## Payment Flow

### During Student Registration:
1. Student fills registration form
2. If initial payment is provided:
   - Student is registered with full course fee as pending
   - Initial payment is processed immediately
   - Pending fees are reduced by the initial payment amount
   - Receipt is generated for the initial payment

### During Regular Payments:
1. Admin selects student for payment
2. Payment amount is entered (cannot exceed pending fees)
3. Payment is processed through `/api/payments/process`
4. Student's pending fees are updated
5. Receipt is generated and stored
6. Payment history is updated

## Database Updates

### Student Table:
- `pendingFees` field is updated after each payment
- Formula: `newPendingFees = currentPendingFees - paymentAmount`

### Receipt Table:
- Stores payment amount (`receiptAmount`)
- Links to payment record (`paymentId`)
- Includes receipt number, date, and payment type

## API Endpoints Used

### Backend Endpoints:
- `POST /api/payment-with-type` - Process payment
- `PUT /api/students/{id}` - Update student pending fees
- `POST /api/receipts` - Create receipt record
- `GET /api/receipts` - Fetch receipt history
- `GET /api/payment-types` - Fetch payment types

### Frontend API Routes:
- `POST /api/payments/process` - Payment processing with validation
- `GET /api/payments/history?studentId={id}` - Fetch payment history

## Error Handling

- Payment amount validation (cannot exceed pending fees)
- Authentication token validation
- Proper error messages for failed operations
- Graceful handling of receipt creation failures

## Security Features

- JWT token authentication for all API calls
- Input validation and sanitization
- Proper error handling without exposing sensitive information

## Testing

To test the implementation:
1. Register a new student with initial payment
2. Verify pending fees are calculated correctly
3. Make additional payments and verify pending fees reduction
4. Check payment history and receipt generation
5. Verify all amounts are properly tracked

## Notes

- The system ensures that pending fees can never go below 0
- All monetary calculations use proper decimal handling
- Receipt numbers are auto-generated with timestamp and student ID
- Payment history is maintained for audit purposes
