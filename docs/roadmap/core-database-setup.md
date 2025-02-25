# Fashionista Portal - Supabase Database Setup Guide

## Quick Links
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Database Schema Creation](#database-schema-creation)
- [Security Configuration](#security-configuration)
- [API Setup](#api-setup)
- [Testing & Verification](#testing--verification)

## Prerequisites

### Required Tools & Access
1. Supabase Account
   - Sign up at https://supabase.com
   - Create a new organization (if needed)
   - Note down your organization ID

2. Development Environment
   - PostgreSQL client (optional, for local testing)
   - Supabase CLI installed
   - Node.js and npm installed

### Project Setup
1. Create New Project
   ```bash
   # Create new Supabase project
   supabase init
   ```

2. Environment Configuration
   ```bash
   # Create .env file
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Initial Setup

### 1. Project Creation in Supabase Dashboard
1. Log into Supabase Dashboard
2. Click "New Project"
3. Enter project details:
   - Name: "fashionista-portal"
   - Database Password: [secure password]
   - Region: [select nearest]
4. Click "Create Project"

### 2. Database Configuration
1. Set Database Settings
   ```sql
   -- Enable necessary extensions
   create extension if not exists "uuid-ossp";
   create extension if not exists "pgcrypto";
   create extension if not exists "citext";
   ```

2. Configure Timezone
   ```sql
   alter database postgres set timezone to 'UTC';
   ```

## Database Schema Creation

### 1. Core Tables Setup

#### Users & Profiles
```sql
-- Create users table
create table public.users (
    id uuid primary key default uuid_generate_v4(),
    email citext unique not null,
    password_hash text not null,
    full_name text not null,
    phone_number text,
    user_type text check (user_type in ('admin', 'organizer', 'designer', 'model', 'attendee')),
    status text check (status in ('active', 'inactive', 'pending')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    last_login timestamp with time zone,
    profile_image_url text,
    preferences jsonb default '{}'::jsonb
);

-- Create user_profiles table
create table public.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    bio text,
    social_links jsonb default '{}'::jsonb,
    company text,
    position text,
    location text,
    preferences jsonb default '{}'::jsonb,
    unique(user_id)
);
```

#### Events & Schedules
```sql
-- Create venues table first (required for events)
create table public.venues (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    address varchar not null,
    city varchar not null,
    country varchar not null,
    capacity integer,
    facilities jsonb default '{}'::jsonb,
    contact_info jsonb default '{}'::jsonb,
    meta_data jsonb default '{}'::jsonb
);

-- Create events table
create table public.events (
    id uuid primary key default uuid_generate_v4(),
    organizer_id uuid references public.users(id) on delete restrict,
    title varchar not null,
    description text,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    venue_id uuid references public.venues(id) on delete restrict,
    status varchar not null default 'draft' check (status in ('draft', 'published', 'cancelled', 'completed')),
    capacity integer,
    type varchar not null check (type in ('fashion_show', 'exhibition', 'workshop')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    meta_data jsonb default '{}'::jsonb
);

-- Create event_schedules table
create table public.event_schedules (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid references public.events(id) on delete cascade,
    title varchar not null,
    description text,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    location varchar,
    type varchar,
    "order" integer,
    created_at timestamp with time zone default now()
);
```

#### Tickets & Orders
```sql
-- Create ticket_types table
create table public.ticket_types (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid references public.events(id) on delete cascade,
    name varchar not null,
    description text,
    price decimal(10,2) not null,
    quantity integer not null,
    benefits jsonb default '{}'::jsonb,
    sale_start timestamp with time zone,
    sale_end timestamp with time zone,
    status varchar not null default 'active' check (status in ('active', 'inactive', 'sold_out')),
    created_at timestamp with time zone default now()
);

-- Create orders table
create table public.orders (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete restrict,
    status varchar not null default 'pending' check (status in ('pending', 'completed', 'cancelled', 'refunded')),
    total_amount decimal(10,2) not null,
    payment_status varchar not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    meta_data jsonb default '{}'::jsonb
);

-- Create tickets table
create table public.tickets (
    id uuid primary key default uuid_generate_v4(),
    ticket_type_id uuid references public.ticket_types(id) on delete restrict,
    order_id uuid references public.orders(id) on delete restrict,
    user_id uuid references public.users(id) on delete restrict,
    status varchar not null default 'valid' check (status in ('valid', 'used', 'cancelled', 'refunded')),
    purchase_date timestamp with time zone default now(),
    qr_code varchar unique,
    meta_data jsonb default '{}'::jsonb
);
```

#### Fashion Industry Tables
```sql
-- Create designers table
create table public.designers (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete restrict,
    brand_name varchar not null,
    portfolio_url varchar,
    specialties varchar[] default array[]::varchar[],
    experience_level varchar,
    achievements jsonb default '{}'::jsonb,
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Create collections table
create table public.collections (
    id uuid primary key default uuid_generate_v4(),
    designer_id uuid references public.designers(id) on delete cascade,
    name varchar not null,
    description text,
    season varchar,
    year integer,
    status varchar not null default 'draft' check (status in ('draft', 'published', 'archived')),
    images jsonb default '{}'::jsonb,
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Create models table
create table public.models (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete restrict,
    height decimal(5,2),
    measurements jsonb default '{}'::jsonb,
    portfolio_url varchar,
    experience_level varchar,
    availability jsonb default '{}'::jsonb,
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);
```

#### Marketing & Communication
```sql
-- Create campaigns table
create table public.campaigns (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    status varchar not null default 'draft' check (status in ('draft', 'active', 'completed')),
    type varchar not null check (type in ('email', 'social', 'push')),
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Create notifications table
create table public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    type varchar not null check (type in ('email', 'sms', 'push')),
    title varchar not null,
    content text,
    status varchar not null default 'pending' check (status in ('pending', 'sent', 'failed')),
    sent_at timestamp with time zone,
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);
```

### 2. Additional Required Tables

#### Sponsorship Management
```sql
-- Create sponsors table
create table public.sponsors (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    contact_info jsonb not null,
    logo_url varchar,
    website varchar,
    description text,
    meta_data jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Create sponsorship_packages table
create table public.sponsorship_packages (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    benefits jsonb not null,
    price decimal(10,2),
    created_at timestamp with time zone default now()
);

-- Create event_sponsorships table
create table public.event_sponsorships (
    id uuid primary key default uuid_generate_v4(),
    event_id uuid references public.events(id) on delete cascade,
    sponsor_id uuid references public.sponsors(id) on delete restrict,
    package_id uuid references public.sponsorship_packages(id) on delete restrict,
    status varchar not null default 'pending' check (status in ('pending', 'active', 'completed')),
    created_at timestamp with time zone default now()
);
```

#### Staff Management
```sql
-- Create staff_roles table
create table public.staff_roles (
    id uuid primary key default uuid_generate_v4(),
    name varchar not null,
    description text,
    permissions jsonb default '{}'::jsonb,
    created_at timestamp with time zone default now()
);

-- Create staff table
create table public.staff (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete restrict,
    role_id uuid references public.staff_roles(id) on delete restrict,
    status varchar not null default 'active' check (status in ('active', 'inactive')),
    created_at timestamp with time zone default now()
);

-- Create staff_assignments table
create table public.staff_assignments (
    id uuid primary key default uuid_generate_v4(),
    staff_id uuid references public.staff(id) on delete restrict,
    event_id uuid references public.events(id) on delete cascade,
    role_id uuid references public.staff_roles(id) on delete restrict,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    notes text,
    created_at timestamp with time zone default now()
);
```

## Security Configuration

### 1. Row Level Security (RLS)
```sql
-- Enable RLS on all tables
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.events enable row level security;
-- ... (repeat for all tables)

-- Create policies
create policy "Users can view their own data"
    on public.users
    for select
    using (auth.uid() = id);

create policy "Public can view published events"
    on public.events
    for select
    using (status = 'published');
```

### 2. Function Permissions
```sql
-- Create custom functions with appropriate permissions
create function public.get_user_events(user_id uuid)
returns setof public.events
language sql
security definer
set search_path = public
stable
as $$
    select * from public.events
    where organizer_id = user_id
    or id in (
        select event_id from public.tickets
        where user_id = user_id
    );
$$;
```

## API Setup

### 1. Create API Views
```sql
-- Create public views for safe data access
create view public.event_details as
select 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    v.name as venue_name,
    v.city,
    v.country
from public.events e
join public.venues v on e.venue_id = v.id
where e.status = 'published';
```

### 2. Setup API Functions
```sql
-- Create API functions
create function public.search_events(search_term text)
returns setof public.event_details
language plpgsql
security definer
set search_path = public
stable
as $$
begin
    return query
    select *
    from public.event_details
    where 
        title ilike '%' || search_term || '%'
        or description ilike '%' || search_term || '%';
end;
$$;
```

## Testing & Verification

### 1. Test Data Insertion
```sql
-- Insert test data
insert into public.users (email, password_hash, full_name, user_type)
values 
    ('admin@test.com', 'hash', 'Admin User', 'admin'),
    ('organizer@test.com', 'hash', 'Event Organizer', 'organizer');

-- Insert test venue
insert into public.venues (name, address, city, country)
values 
    ('Test Venue', '123 Test St', 'Test City', 'Test Country');
```

### 2. Verify Relationships
```sql
-- Test queries
select * from public.get_user_events('user-uuid-here');
select * from public.search_events('test');
```

## Maintenance Tasks

### 1. Regular Maintenance
```sql
-- Create maintenance functions
create function public.cleanup_old_sessions()
returns void
language plpgsql
security definer
as $$
begin
    delete from auth.sessions
    where created_at < now() - interval '30 days';
end;
$$;
```

### 2. Monitoring Setup
```sql
-- Create monitoring views
create view public.system_stats as
select
    (select count(*) from public.users) as total_users,
    (select count(*) from public.events) as total_events,
    (select count(*) from public.tickets) as total_tickets;
```

Remember:
- Always backup before major changes
- Test in staging environment first
- Monitor performance after changes
- Keep security policies updated
- Document all custom functions
- Maintain proper indexing

Need help?
- Supabase Documentation: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Project Support: [Contact Information] 

## Database Migration Process

### Migration Strategy
- **Version Control**
  - Migrations are stored in `src/database/migrations`
  - Format: `YYYYMMDDHHMMSS_description.sql`
  - Core migrations prefixed with `000000_`
  - Each migration has up/down scripts

### Running Migrations
```bash
# Run all pending migrations
npm run db:migrate

# Run specific migration
npm run db:migrate:up [migration-name]

# Rollback last migration
npm run db:migrate:down
```

### Rollback Procedures
1. **Single Migration Rollback**
   ```bash
   npm run db:rollback [migration-name]
   ```

2. **Batch Rollback**
   ```bash
   npm run db:rollback --step [number]
   ```

3. **Emergency Rollback**
   ```bash
   npm run db:rollback:emergency
   ```

## Environment Variables

### Core Variables
```env
# Development
VITE_SUPABASE_URL=your_dev_project_url
SUPABASE_SERVICE_KEY=your_dev_service_key
SUPABASE_ANON_KEY=your_dev_anon_key
DATABASE_URL=your_dev_db_url

# Staging
VITE_SUPABASE_URL_STAGING=your_staging_project_url
SUPABASE_SERVICE_KEY_STAGING=your_staging_service_key
SUPABASE_ANON_KEY_STAGING=your_staging_anon_key
DATABASE_URL_STAGING=your_staging_db_url

# Production
VITE_SUPABASE_URL_PROD=your_prod_project_url
SUPABASE_SERVICE_KEY_PROD=your_prod_service_key
SUPABASE_ANON_KEY_PROD=your_prod_anon_key
DATABASE_URL_PROD=your_prod_db_url
```

### Environment Configuration
1. Development
   - Debug logging enabled
   - Full error messages
   - Development features on

2. Staging
   - Limited logging
   - Sanitized errors
   - Production-like settings

3. Production
   - Minimal logging
   - Secure error messages
   - Maximum performance

## Error Handling & Recovery

### Common Setup Issues
1. **Connection Errors**
   ```bash
   # Verify connection
   npm run db:verify-connection

   # Reset connection pool
   npm run db:reset-pool
   ```

2. **Permission Issues**
   ```bash
   # Verify permissions
   npm run db:check-permissions

   # Reset permissions
   npm run db:reset-permissions
   ```

3. **Migration Failures**
   ```bash
   # Check migration status
   npm run db:migration-status

   # Fix broken migrations
   npm run db:migration-fix
   ```

### Recovery Procedures
1. **Failed Setup Recovery**
   ```bash
   # Clean setup state
   npm run db:clean

   # Reinitialize database
   npm run db:reinit
   ```

2. **Data Recovery**
   ```bash
   # Point-in-time recovery
   npm run db:recover --timestamp [ISO_TIMESTAMP]
   ```

## Performance Optimization

### Index Strategy
1. **Core Indexes**
   ```sql
   -- Primary search fields
   CREATE INDEX idx_events_title_trgm ON events USING gin (title gin_trgm_ops);
   CREATE INDEX idx_events_description_trgm ON events USING gin (description gin_trgm_ops);

   -- Frequently filtered fields
   CREATE INDEX idx_events_status_date ON events(status, start_date);
   CREATE INDEX idx_venues_city_country ON venues(city, country);

   -- Foreign key indexes
   CREATE INDEX idx_tickets_event_id ON tickets(event_id);
   CREATE INDEX idx_bookings_user_id ON bookings(user_id);
   ```

2. **Query Optimization**
   ```sql
   -- Enable query monitoring
   ALTER DATABASE fashionista SET track_io_timing = ON;
   ALTER DATABASE fashionista SET track_functions = ALL;

   -- Set statement timeout
   ALTER DATABASE fashionista SET statement_timeout = '30s';
   ```

### Performance Monitoring
```bash
# Monitor query performance
npm run db:monitor-queries

# Analyze slow queries
npm run db:analyze-slow-queries

# Generate performance report
npm run db:performance-report
```

## Backup & Restore

### Automated Backups
```bash
# Configure automated backups
npm run db:configure-backups

# Manual backup
npm run db:backup

# List available backups
npm run db:list-backups
```

### Restore Procedures
```bash
# Full database restore
npm run db:restore [backup-name]

# Selective restore
npm run db:restore-selective --tables [table-names]

# Point-in-time restore
npm run db:restore-point --timestamp [ISO_TIMESTAMP]
```

### Disaster Recovery
1. **Emergency Procedures**
   ```bash
   # Activate emergency mode
   npm run db:emergency-mode

   # Execute recovery plan
   npm run db:execute-recovery
   ```

2. **Recovery Testing**
   ```bash
   # Test recovery procedure
   npm run db:test-recovery

   # Validate restored data
   npm run db:validate-recovery
   ```

## Integration Setup

### External Services
1. **Payment Integration**
   ```bash
   # Configure Stripe
   npm run db:configure-stripe

   # Configure PayPal
   npm run db:configure-paypal
   ```

2. **Storage Integration**
   ```bash
   # Configure S3
   npm run db:configure-s3

   # Configure Cloudinary
   npm run db:configure-cloudinary
   ```

### API Configuration
```bash
# Generate API keys
npm run db:generate-api-keys

# Configure rate limiting
npm run db:configure-rate-limits

# Set up API documentation
npm run db:generate-api-docs
```

## Monitoring & Logging

### Logging Configuration
```bash
# Configure log levels
npm run db:configure-logging

# Set up log rotation
npm run db:configure-log-rotation

# Enable query logging
npm run db:enable-query-logging
```

### Monitoring Setup
1. **Performance Monitoring**
   ```bash
   # Enable metrics collection
   npm run db:enable-metrics

   # Configure dashboards
   npm run db:setup-dashboards
   ```

2. **Alerting System**
   ```bash
   # Configure alerts
   npm run db:configure-alerts

   # Test alert system
   npm run db:test-alerts
   ```

## Security Hardening

### SSL/TLS Configuration
```bash
# Enable SSL
npm run db:enable-ssl

# Configure SSL certificates
npm run db:configure-ssl

# Test SSL connection
npm run db:test-ssl
```

### Security Best Practices
1. **Access Control**
   ```sql
   -- Enable row level security
   ALTER TABLE events ENABLE ROW LEVEL SECURITY;
   ALTER TABLE venues ENABLE ROW LEVEL SECURITY;

   -- Create security policies
   CREATE POLICY "Public can view published events" ON events
     FOR SELECT USING (status = 'published');
   ```

2. **Data Encryption**
   ```sql
   -- Enable encryption at rest
   ALTER DATABASE fashionista SET encrypted = true;

   -- Enable SSL for connections
   ALTER SYSTEM SET ssl = on;
   ```

3. **Audit Logging**
   ```sql
   -- Enable audit logging
   CREATE EXTENSION IF NOT EXISTS pgaudit;
   ALTER SYSTEM SET pgaudit.log = 'write, ddl';
   ```

Remember: 
- Regularly update security configurations
- Monitor security logs
- Conduct security audits
- Keep SSL certificates updated
- Review access policies
- Test security measures

Need Help?
- Contact: support@fashionista-portal.com
- Documentation: docs.fashionista-portal.com
- Emergency: emergency@fashionista-portal.com 