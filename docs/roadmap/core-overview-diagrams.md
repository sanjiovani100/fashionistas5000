# Fashionista Portal - Core System Diagrams

## System Architecture

### High-Level Architecture
```mermaid
graph TB
    Client[Client Layer] --> API[API Layer]
    API --> Services[Service Layer]
    Services --> Data[Data Layer]
    
    subgraph Client Layer
        Web[Web Application]
        Mobile[Mobile Views]
        Admin[Admin Dashboard]
    end
    
    subgraph Integration Layer
        Stripe[Stripe Payments]
        Cloudinary[Media Storage]
        WhatsApp[WhatsApp API]
    end
    
    Services --> Integration Layer
    Data --> Cache[Cache Layer]
```

## User Journeys

### 1. Attendee Flow
```mermaid
graph LR
    A[Browse Events] --> B[Select Event]
    B --> C[Choose Tickets]
    C --> D[Payment]
    D --> E[Receive Confirmation]
    E --> F[Attend Event]
```

### 2. Designer Flow
```mermaid
graph LR
    A[Create Profile] --> B[Upload Collection]
    B --> C[Apply for Shows]
    C --> D[Manage Shows]
    D --> E[Track Performance]
```

### 3. Admin Flow
```mermaid
graph LR
    A[Monitor Dashboard] --> B[Manage Events]
    B --> C[Handle Users]
    C --> D[Process Payments]
    D --> E[Generate Reports]
```

## Database Structure

### Core Tables Overview
```mermaid
erDiagram
    USERS ||--o{ EVENTS : organizes
    EVENTS ||--o{ TICKETS : has
    USERS ||--o{ TICKETS : purchases
    EVENTS ||--|| VENUES : hosted_at
    DESIGNERS ||--o{ COLLECTIONS : creates
    COLLECTIONS ||--o{ SHOWS : featured_in
```

## Additional System Flows

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant A as Auth Service
    participant D as Database

    U->>C: Login Request
    C->>A: Validate Credentials
    A->>D: Check User
    D-->>A: User Data
    A->>A: Generate Token
    A-->>C: Auth Token
    C-->>U: Login Success
```

### Payment Processing Flow
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant S as Stripe
    participant B as Backend
    participant D as Database

    U->>C: Initiate Payment
    C->>S: Create Payment Intent
    S-->>C: Payment Intent
    C->>U: Confirm Payment
    U->>S: Process Payment
    S-->>B: Payment Success
    B->>D: Update Order
    B-->>U: Confirmation
```

### Event Creation Flow
```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Review: Submit
    Review --> Revision: Need Changes
    Review --> Published: Approved
    Revision --> Review: Resubmit
    Published --> [*]
```

### Media Upload Flow
```mermaid
sequenceDiagram
    participant U as User
    participant C as Client
    participant CL as Cloudinary
    participant B as Backend
    participant D as Database

    U->>C: Upload Media
    C->>CL: Process Media
    CL-->>C: Media URL
    C->>B: Save Media Info
    B->>D: Store Reference
    B-->>U: Upload Complete
```

### Notification System
```mermaid
graph TD
    A[Event Trigger] --> B{Notification Type}
    B -->|Email| C[Email Service]
    B -->|WhatsApp| D[WhatsApp API]
    B -->|Push| E[Push Service]
    C --> F[Delivery Status]
    D --> F
    E --> F
    F --> G[Update Database]
```

### Cache Strategy
```mermaid
graph LR
    A[Request] --> B{Cache Check}
    B -->|Hit| C[Return Cached]
    B -->|Miss| D[Fetch Data]
    D --> E[Update Cache]
    E --> F[Return Fresh]
```

### Monitoring System
```mermaid
graph TD
    A[System Metrics] --> B{Health Check}
    B -->|OK| C[Log Status]
    B -->|Warning| D[Alert Team]
    B -->|Critical| E[Emergency Response]
    C --> F[Update Dashboard]
    D --> F
    E --> F
```

### Backup Process
```mermaid
graph TD
    A[Scheduled Backup] --> B{Type}
    B -->|Full| C[Weekly Backup]
    B -->|Incremental| D[Daily Backup]
    B -->|Transaction| E[Real-time Log]
    C --> F[Cloud Storage]
    D --> F
    E --> G[Log Storage]
```

Remember: These diagrams provide visual representations of the core system flows and architecture. They should be used in conjunction with the main documentation for a complete understanding of the system. 