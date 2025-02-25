# Event Listings Page Setup Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Design System](#design-system)
- [Component Architecture](#component-architecture)
- [Database Layer](#database-layer)
- [API Integration](#api-integration)
- [Testing & Deployment](#testing--deployment)

## Overview

The Event Listings page is a core feature of the Fashionista Portal that displays fashion events in a responsive grid layout with filtering, sorting, and search capabilities.

### Key Features
- Responsive grid layout of event cards
- Advanced filtering system
- Search and sort functionality
- Lazy loading and pagination
- Accessibility compliance
- Mobile-first design

## Prerequisites

### Required Dependencies
```bash
# Core dependencies
npm install @supabase/supabase-js    # Database integration
npm install @tanstack/react-query     # Data fetching and caching
npm install date-fns                  # Date formatting
npm install zod                       # Schema validation

# UI Components
npm install @radix-ui/react-dialog    # Modal dialogs
npm install @radix-ui/react-select    # Select dropdowns
npm install @radix-ui/react-tabs     # Tab navigation
```

### Environment Configuration
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Design System

### 1. Color Palette
```css
:root {
  /* Brand Colors */
  --primary-100: #E6F3FF;
  --primary-500: #2B6CB0;
  --primary-900: #1A365D;
  
  /* Accent Colors */
  --accent-500: #ED64A6;
  --accent-600: #D53F8C;
  
  /* Neutral Colors */
  --gray-50: #F7FAFC;
  --gray-100: #EDF2F7;
  --gray-300: #E2E8F0;
  --gray-500: #718096;
  --gray-700: #4A5568;
  --gray-900: #1A202C;
}
```

### 2. Typography
```css
:root {
  /* Font Families */
  --font-primary: 'Inter', sans-serif;
  --font-display: 'Playfair Display', serif;

  /* Font Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
}
```

### 3. Layout Grid
```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Grid System */
.grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

/* Responsive Breakpoints */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## Component Architecture

### 1. Page Layout
```typescript
// pages/events/index.tsx
export default function EventListingsPage() {
  return (
    <div className="flex min-h-screen">
      <FilterSidebar />
      <main className="flex-1">
        <SearchSortBar />
        <EventGrid />
        <Pagination />
      </main>
    </div>
  );
}
```

### 2. Filter Sidebar
```typescript
interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar = styled.aside`
  position: sticky;
  top: 0;
  height: calc(100vh - 64px);
  width: 280px;
  padding: 24px;
  background: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  overflow-y: auto;

  @media (max-width: 768px) {
    position: fixed;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    z-index: 40;
  }
`;
```

### 3. Event Card Component
```typescript
const EventCard = styled.article`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    position: relative;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
  }

  .content {
    padding: 16px;
  }
`;
```

### 4. Interactive Elements

```typescript
// Button Component
const Button = styled.button<{ variant: 'primary' | 'secondary' | 'outline' }>`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;

  ${props => props.variant === 'primary' && css`
    background: var(--primary-500);
    color: white;
    &:hover { background: var(--primary-600); }
  `}
`;

// Filter Chip Component
const FilterChip = styled.button<{ active: boolean }>`
  padding: 4px 12px;
  border-radius: 999px;
  font-size: var(--text-sm);
  transition: all 0.2s ease;
  
  ${props => props.active ? css`
    background: var(--primary-100);
    color: var(--primary-900);
    border: 1px solid var(--primary-500);
  ` : css`
    background: white;
    color: var(--gray-700);
    border: 1px solid var(--gray-300);
  `}
`;
```

### 5. Image Handling
```typescript
interface ImageConfig {
  formats: ['webp', 'jpg'];
  sizes: {
    thumbnail: { width: 150, height: 150 },
    card: { width: 300, height: 169 },
    banner: { width: 1200, height: 675 }
  };
  quality: {
    low: 60,
    medium: 75,
    high: 85
  };
}

// Usage Example
<Image
  src={event.bannerImageUrl}
  alt={event.title}
  width={300}
  height={169}
  quality={75}
  loading="lazy"
  placeholder="blur"
  blurDataURL={event.blurHash}
/>
```

## Database Layer

### 1. Schema Definition
```sql
-- Events Table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue_id UUID REFERENCES venues(id),
  organizer_id UUID REFERENCES users(id),
  capacity INTEGER,
  status VARCHAR(50) DEFAULT 'draft',
  ticket_types JSONB,
  featured BOOLEAN DEFAULT false,
  banner_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE event_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- Mappings
CREATE TABLE event_category_mappings (
  event_id UUID REFERENCES events(id),
  category_id UUID REFERENCES event_categories(id),
  PRIMARY KEY (event_id, category_id)
);
```

### 2. Security Policies
```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public events are viewable by everyone"
ON events FOR SELECT
USING (status = 'published');

CREATE POLICY "Events can be updated by organizers"
ON events FOR UPDATE
TO authenticated
USING (auth.uid() = organizer_id);
```

## API Integration

### 1. Type Definitions
```typescript
// types/events.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  venueId: string;
  organizerId: string;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled';
  ticketTypes: TicketType[];
  featured: boolean;
  bannerImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventFilters {
  category?: string;
  featured?: boolean;
  startDate?: Date;
  endDate?: Date;
  priceRange?: [number, number];
}
```

### 2. API Service
```typescript
// services/eventService.ts
export const eventService = {
  async getEvents(params: {
    page: number;
    limit: number;
    filters: EventFilters;
  }) {
    const { page, limit, filters } = params;
    const query = supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('eventDate', { ascending: true });

    // Apply filters
    if (filters.category) {
      query.eq('category', filters.category);
    }
    if (filters.featured) {
      query.eq('featured', true);
    }

    const { data, error, count } = await query
      .range(page * limit, (page + 1) * limit - 1)
      .count();

    if (error) throw error;
    return { events: data, total: count };
  }
};
```

## Testing & Deployment

### 1. Component Testing
```typescript
// __tests__/components/EventCard.test.tsx
describe('EventCard', () => {
  const mockEvent = {
    id: '1',
    title: 'Test Event',
    description: 'Test Description',
    eventDate: new Date().toISOString(),
  };

  it('renders event details correctly', () => {
    render(<EventCard event={mockEvent} />);
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing
```typescript
// cypress/e2e/events.cy.ts
describe('Event Listings', () => {
  beforeEach(() => {
    cy.visit('/events');
  });

  it('filters events correctly', () => {
    cy.get('[data-testid="category-select"]').click();
    cy.get('[data-testid="category-option"]').first().click();
    cy.get('[data-testid="event-card"]').should('exist');
  });
});
```

### 3. Deployment Checklist
- [ ] Run full test suite
- [ ] Verify database migrations
- [ ] Check environment variables
- [ ] Build and optimize assets
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Monitor analytics

## Performance Optimization

### 1. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Optimize image formats
- Use appropriate sizes
- Implement blur placeholder

### 2. Code Splitting
- Use dynamic imports
- Implement route-based splitting
- Optimize bundle size
- Implement tree shaking
- Monitor bundle analyzer

### 3. Caching Strategy
- Implement React Query
- Use SWR for data fetching
- Cache API responses
- Optimize revalidation
- Monitor cache hit rates