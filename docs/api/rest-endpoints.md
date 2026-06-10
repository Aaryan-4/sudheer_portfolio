# REST API Endpoints

## Authentication

### `GET /api/auth/[...nextauth]`

Handles NextAuth session and provider routes.

### `POST /api/auth/[...nextauth]`

Handles credentials sign-in callbacks.

## Contact

### `POST /api/contact`

Creates a contact message and sends an admin notification.

Request:

```json
{
  "name": "Sudheer Kumar",
  "email": "person@example.com",
  "subject": "Project inquiry",
  "message": "I would like to discuss a project."
}
```

Response:

```json
{
  "data": {
    "id": "uuid"
  }
}
```

Validation: name, valid email, subject, and message are required.

Authentication: public with rate limiting.

## Meetings

### `POST /api/meetings`

Creates a meeting request.

Request:

```json
{
  "fullName": "Visitor Name",
  "email": "visitor@example.com",
  "phone": "+91 9999999999",
  "company": "Example Inc",
  "purpose": "Discuss a collaboration",
  "preferredDate": "2026-07-01",
  "preferredTime": "10:30",
  "duration": "MINUTES_30"
}
```

Response:

```json
{
  "data": {
    "id": "uuid",
    "status": "PENDING"
  }
}
```

Authentication: public with rate limiting.

### `POST /api/meetings/:id/approve`

Approves a meeting, prevents double booking, creates a Google Calendar event when configured, and emails the visitor.

Authentication: `ADMIN`.

## Analytics

### `POST /api/analytics`

Tracks analytics events.

Request:

```json
{
  "eventType": "PAGE_VIEW",
  "path": "/projects",
  "visitorId": "anonymous-id",
  "sessionId": "session-id",
  "referrer": "https://example.com",
  "source": "direct"
}
```

Authentication: public.

## Chatbot

### `POST /api/chatbot`

Returns portfolio-aware answers based on published projects, published blogs, skills, resume, and meeting flow.

Request:

```json
{
  "question": "What projects has Sudheer built?"
}
```

Authentication: public.

## Upload

### `POST /api/upload`

Returns a signed Cloudinary upload payload.

Request:

```json
{
  "folder": "sudheer-portfolio/projects"
}
```

Authentication: `ADMIN`.
