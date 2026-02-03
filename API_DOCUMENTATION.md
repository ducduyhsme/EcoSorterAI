# API Documentation

This document describes the API endpoints that need to be implemented on the backend server for full functionality of the Eco-Sorter AI app.

## Base URL

```
https://your-server.com/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. User Authentication

#### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  },
  "token": "string"
}
```

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "string",
    "username": "string"
  },
  "token": "string"
}
```

### 2. Image Classification

#### Upload Image for Classification
```
POST /classify/upload
```

**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Request Body (Form Data):**
- `image`: File (JPEG/PNG)
- `category`: string (predicted category from local model)
- `confidence`: number (confidence score from local model)
- `timestamp`: string (ISO 8601 timestamp)

**Response:**
```json
{
  "success": true,
  "classification": {
    "category": "string",
    "confidence": 0.95,
    "alternatives": [
      {
        "category": "string",
        "confidence": 0.03
      }
    ],
    "imageUrl": "string",
    "classifiedAt": "string"
  }
}
```

#### Get Classification by ID
```
GET /classify/:id
```

**Response:**
```json
{
  "success": true,
  "classification": {
    "id": "string",
    "category": "string",
    "confidence": 0.95,
    "imageUrl": "string",
    "userId": "string",
    "createdAt": "string"
  }
}
```

### 3. User History

#### Get User Classification History
```
GET /history
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20, max: 100)
- `category`: string (optional filter)
- `startDate`: string (ISO 8601, optional)
- `endDate`: string (ISO 8601, optional)

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": "string",
      "category": "string",
      "confidence": 0.95,
      "imageUrl": "string",
      "timestamp": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

#### Sync User Data
```
POST /history/sync
```

**Request Body:**
```json
{
  "history": [
    {
      "category": "string",
      "confidence": 0.95,
      "imageUri": "string",
      "timestamp": "string"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "synced": 25,
  "message": "Successfully synced 25 items"
}
```

### 4. Rankings

#### Get Global Rankings
```
GET /rankings
```

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 50, max: 100)
- `timeframe`: string (all|week|month, default: all)

**Response:**
```json
{
  "success": true,
  "rankings": [
    {
      "rank": 1,
      "username": "string",
      "totalScans": 156,
      "accurateScans": 145,
      "points": 3580,
      "avatarUrl": "string"
    }
  ],
  "currentUser": {
    "rank": 42,
    "username": "string",
    "totalScans": 25,
    "points": 450
  }
}
```

#### Update User Stats
```
POST /rankings/update
```

**Request Body:**
```json
{
  "totalScans": 25,
  "accurateScans": 23,
  "points": 450
}
```

**Response:**
```json
{
  "success": true,
  "rank": 42,
  "points": 450
}
```

### 5. Training Data

#### Submit Training Data
```
POST /training/submit
```

**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Request Body (Form Data):**
- `image`: File
- `category`: string (verified category)
- `confidence`: number

**Response:**
```json
{
  "success": true,
  "message": "Training data submitted successfully",
  "contributionPoints": 50
}
```

#### Get Training Statistics
```
GET /training/stats
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalSamples": 10000,
    "categoryCounts": {
      "Organic": 5500,
      "Inorganic": 4500
    },
    "lastModelUpdate": "string"
  }
}
```

### 6. Model Updates

#### Check for Model Updates
```
GET /model/check-update
```

**Response:**
```json
{
  "success": true,
  "updateAvailable": true,
  "version": "1.1.0",
  "releaseDate": "string",
  "improvements": [
    "Improved plastic classification accuracy",
    "Added better glass detection"
  ],
  "downloadUrl": "string",
  "size": 15728640
}
```

#### Download Model
```
GET /model/download/:version
```

**Response:**
Binary file (TensorFlow.js model archive)

### 7. Cloud Storage

#### Upload Image
```
POST /storage/upload
```

**Headers:**
- `Content-Type: multipart/form-data`
- `Authorization: Bearer <token>`

**Request Body (Form Data):**
- `image`: File
- `metadata`: JSON string

**Response:**
```json
{
  "success": true,
  "imageUrl": "string",
  "thumbnailUrl": "string",
  "imageId": "string"
}
```

#### Get User Images
```
GET /storage/images
```

**Query Parameters:**
- `page`: number
- `limit`: number
- `category`: string (optional)

**Response:**
```json
{
  "success": true,
  "images": [
    {
      "id": "string",
      "url": "string",
      "thumbnailUrl": "string",
      "category": "string",
      "uploadedAt": "string"
    }
  ]
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required or token invalid
- `FORBIDDEN`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed
- `SERVER_ERROR`: Internal server error
- `RATE_LIMIT`: Too many requests

## Rate Limiting

All endpoints are rate-limited:
- Authentication endpoints: 5 requests per minute
- Upload endpoints: 20 requests per minute
- GET endpoints: 60 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1640000000
```

## Webhooks (Optional)

### Model Training Complete
```
POST <webhook_url>
```

**Payload:**
```json
{
  "event": "model.training.complete",
  "version": "1.1.0",
  "accuracy": 0.92,
  "timestamp": "string"
}
```

### Classification Feedback
```
POST <webhook_url>
```

**Payload:**
```json
{
  "event": "classification.feedback",
  "classificationId": "string",
  "originalCategory": "string",
  "correctedCategory": "string",
  "userId": "string"
}
```

## Implementation Notes

### Security
- Use HTTPS for all endpoints
- Implement CORS properly
- Validate all inputs
- Sanitize file uploads
- Use secure password hashing (bcrypt)
- Implement JWT with expiration

### Performance
- Implement caching for rankings
- Use CDN for image storage
- Compress images before storage
- Paginate large responses
- Use database indexing

### Storage
- Use cloud storage (AWS S3, Google Cloud Storage, etc.)
- Generate thumbnails for images
- Implement image cleanup for old data
- Use object storage for model files

### Database Schema (Suggested)

**Users Table:**
- id (UUID)
- username (string, unique)
- email (string, unique)
- password_hash (string)
- created_at (timestamp)
- updated_at (timestamp)

**Classifications Table:**
- id (UUID)
- user_id (UUID, FK)
- image_url (string)
- category (string)
- confidence (float)
- local_confidence (float)
- created_at (timestamp)

**TrainingData Table:**
- id (UUID)
- image_url (string)
- category (string)
- verified (boolean)
- contributed_by (UUID, FK)
- created_at (timestamp)

**Rankings Table:**
- user_id (UUID, FK)
- total_scans (integer)
- accurate_scans (integer)
- points (integer)
- updated_at (timestamp)

## Testing

Use the provided Postman collection (to be created) for testing all endpoints.

Example cURL request:
```bash
curl -X POST https://your-server.com/api/classify/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "category=Organic" \
  -F "confidence=0.65" \
  -F "timestamp=2024-01-15T12:00:00Z"
```

## Future Enhancements

- GraphQL API option
- Real-time updates via WebSocket
- Batch classification endpoint
- Export data endpoint
- Analytics dashboard API
- Social features API (sharing, comments)
