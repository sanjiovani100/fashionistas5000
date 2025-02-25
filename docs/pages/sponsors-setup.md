# Sponsors Page Setup Guide

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Design System](#design-system)
- [UI/UX Wireframe Layout](#uiux-wireframe-layout)
- [Component Architecture](#component-architecture)
- [Database Layer](#database-layer)
- [API Integration](#api-integration)
- [Testing & Deployment](#testing--deployment)

## Overview

The Sponsors page is a crucial feature of the Fashionista Portal that showcases event sponsors, manages sponsorship packages, and handles sponsor relationships.

### Key Features
- Sponsor showcase grid
- Sponsorship package display
- Sponsor dashboard
- ROI tracking
- Sponsor benefits management
- Analytics integration

## Prerequisites

### Required Dependencies
```bash
# Core dependencies
npm install @supabase/supabase-js    # Database integration
npm install @tanstack/react-query     # Data fetching
npm install chart.js                  # Analytics charts
npm install @react-pdf/renderer       # PDF generation

# UI Components
npm install @radix-ui/react-tabs     # Tab navigation
npm install @radix-ui/react-dialog    # Modal dialogs
npm install @radix-ui/react-select    # Dropdown selects
npm install @radix-ui/react-tooltip   # Tooltips
```

### Environment Configuration
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_key
```

## Design System

### 1. Color Palette
```css
:root {
  /* Brand Colors */
  --sponsor-primary: #2C5282;
  --sponsor-secondary: #9F7AEA;
  
  /* Tier Colors */
  --platinum: #E5E7EB;
  --gold: #FBD38D;
  --silver: #CBD5E0;
  --bronze: #ED8936;
  
  /* UI Colors */
  --success: #48BB78;
  --warning: #ECC94B;
  --error: #F56565;
  --info: #4299E1;
}
```

### 2. Typography
```css
:root {
  /* Sponsor-specific Typography */
  --sponsor-heading: 'Playfair Display', serif;
  --sponsor-body: 'Inter', sans-serif;
  
  /* Font Sizes */
  --sponsor-title: 2.5rem;
  --package-title: 2rem;
  --benefit-title: 1.25rem;
  --detail-text: 0.875rem;
}
```

### 3. Layout Grid
```css
.sponsors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}
```

## UI/UX Wireframe Layout

### 1. Page Structure
```typescript
// Layout Grid System
const SponsorPageLayout = styled.div`
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 280px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  gap: 2rem;
  padding: 2rem;

  @media (max-width: 768px) {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
`;
```

### 2. Sidebar Navigation
```typescript
const SponsorSidebar = styled.aside`
  grid-area: sidebar;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  .filter-section {
    margin-bottom: 2rem;
  }

  .tier-filter {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-heading {
    font-size: var(--benefit-title);
    font-weight: 600;
    margin-bottom: 1rem;
  }
`;
```

### 3. Main Content Area
```typescript
const SponsorMainContent = styled.main`
  grid-area: main;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .content-wrapper {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
```

### 4. Grid Systems

#### Sponsor Grid
```typescript
const SponsorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  .grid-header {
    grid-column: 1 / -1;
    margin-bottom: 1rem;
  }
`;
```

#### Package Grid
```typescript
const PackageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;
```

### 5. Card Components

#### Enhanced Sponsor Card
```typescript
const EnhancedSponsorCard = styled(SponsorCard)`
  .card-header {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.7) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .card-content {
    padding: 1.5rem;
  }

  .card-actions {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-top: 1px solid var(--border-color);
  }

  &:hover {
    .card-overlay {
      opacity: 1;
    }
    
    img {
      transform: scale(1.05);
    }
  }
`;
```

### 6. Button System
```typescript
const ButtonSystem = {
  Primary: styled.button`
    background: var(--sponsor-primary);
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    transition: background-color 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--sponsor-primary) 90%, black);
    }
  `,

  Secondary: styled.button`
    background: transparent;
    color: var(--sponsor-primary);
    padding: 0.75rem 1.5rem;
    border: 2px solid var(--sponsor-primary);
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: var(--sponsor-primary);
      color: white;
    }
  `,

  Tier: styled.button<{ tier: string }>`
    background: ${props => `var(--${props.tier})`};
    color: var(--gray-900);
    padding: 0.5rem 1rem;
    border-radius: 999px;
    font-size: var(--detail-text);
    font-weight: 500;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  `
};
```

### 7. Image Guidelines
```typescript
const ImageGuidelines = {
  SponsorLogo: {
    dimensions: {
      optimal: '400x400px',
      maxSize: '800x800px',
      aspectRatio: '1:1'
    },
    formats: ['SVG', 'PNG', 'WebP'],
    optimization: {
      quality: 85,
      maxFileSize: '200KB'
    }
  },

  SponsorBanner: {
    dimensions: {
      optimal: '1200x400px',
      maxSize: '2400x800px',
      aspectRatio: '3:1'
    },
    formats: ['WebP', 'JPEG'],
    optimization: {
      quality: 80,
      maxFileSize: '500KB'
    }
  }
};

const ImageComponent = styled.img<{ usage: 'logo' | 'banner' }>`
  ${props => props.usage === 'logo' && `
    aspect-ratio: 1;
    object-fit: contain;
    padding: 1rem;
  `}

  ${props => props.usage === 'banner' && `
    aspect-ratio: 3/1;
    object-fit: cover;
    width: 100%;
  `}
`;
```

### 8. Animation System
```typescript
const animations = {
  fadeIn: keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `,
  
  slideIn: keyframes`
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  `,
  
  scaleIn: keyframes`
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  `
};

const AnimatedComponent = styled.div<{ animation: keyof typeof animations }>`
  animation: ${props => animations[props.animation]} 0.3s ease forwards;
`;
```

### 9. Responsive Behavior
```typescript
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px'
};

const ResponsiveContainer = styled.div`
  @media (max-width: ${breakpoints.sm}) {
    padding: 1rem;
  }

  @media (max-width: ${breakpoints.md}) {
    .grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: ${breakpoints.lg}) {
    .sidebar {
      display: none;
    }
  }
`;
```

### 10. Accessibility Features
```typescript
const AccessibleComponent = styled.div`
  // High contrast mode support
  @media (prefers-contrast: high) {
    --sponsor-primary: #000000;
    --sponsor-secondary: #FFFFFF;
  }

  // Reduced motion support
  @media (prefers-reduced-motion: reduce) {
    * {
      animation: none !important;
      transition: none !important;
    }
  }

  // Focus styles
  :focus-visible {
    outline: 3px solid var(--sponsor-primary);
    outline-offset: 2px;
  }
`;
```

## Component Architecture

### 1. Page Layout
```typescript
// pages/sponsors/index.tsx
export default function SponsorsPage() {
  return (
    <div className="sponsors-container">
      <Header />
      <main>
        <SponsorShowcase />
        <SponsorshipPackages />
        <SponsorBenefits />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
```

### 2. Sponsor Card Component
```typescript
interface SponsorCardProps {
  sponsor: Sponsor;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

const SponsorCard = styled.article<{ tier: SponsorCardProps['tier'] }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  .sponsor-logo {
    width: 100%;
    height: 160px;
    object-fit: contain;
    padding: 1rem;
  }

  .sponsor-content {
    padding: 1.5rem;
    border-top: 4px solid ${props => `var(--${props.tier})`};
  }

  .sponsor-tier {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: ${props => `var(--${props.tier})`};
    color: var(--gray-900);
    font-weight: 500;
    font-size: var(--detail-text);
  }
`;
```

### 3. Package Card Component
```typescript
interface PackageCardProps {
  package: SponsorPackage;
}

const PackageCard = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  .package-header {
    padding: 2rem;
    background: var(--sponsor-primary);
    color: white;
    text-align: center;
  }

  .package-price {
    font-size: 2.5rem;
    font-weight: bold;
    margin: 1rem 0;
  }

  .package-benefits {
    padding: 2rem;
    
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li {
      padding: 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;
```

### 4. Analytics Dashboard
```typescript
interface SponsorAnalytics {
  impressions: number;
  engagement: number;
  roi: number;
  leads: number;
}

const AnalyticsDashboard = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 2rem;

  .metric-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .chart-container {
    grid-column: span 2;
    height: 300px;
  }
`;
```

## Database Layer

### 1. Schema Definition
```sql
-- Sponsors Table
CREATE TABLE sponsors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  tier VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  contact_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsorship Packages
CREATE TABLE sponsorship_packages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tier VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  benefits JSONB,
  max_sponsors INTEGER,
  duration_months INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sponsor Events
CREATE TABLE sponsor_events (
  sponsor_id UUID REFERENCES sponsors(id),
  event_id UUID REFERENCES events(id),
  package_id UUID REFERENCES sponsorship_packages(id),
  contribution_amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  benefits_delivered JSONB,
  analytics JSONB,
  PRIMARY KEY (sponsor_id, event_id)
);

-- Create indexes
CREATE INDEX idx_sponsors_tier ON sponsors(tier);
CREATE INDEX idx_sponsors_status ON sponsors(status);
CREATE INDEX idx_sponsor_events_status ON sponsor_events(status);
```

### 2. Security Policies
```sql
-- Enable RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsor_events ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public sponsors are viewable by everyone"
ON sponsors FOR SELECT
USING (status = 'active');

CREATE POLICY "Packages are viewable by everyone"
ON sponsorship_packages FOR SELECT
USING (true);

CREATE POLICY "Sponsor events are viewable by authenticated users"
ON sponsor_events FOR SELECT
TO authenticated
USING (true);
```

## API Integration

### 1. Type Definitions
```typescript
// types/sponsors.ts
export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  status: 'active' | 'inactive';
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SponsorPackage {
  id: string;
  name: string;
  tier: string;
  price: number;
  benefits: string[];
  maxSponsors: number;
  durationMonths: number;
}

export interface SponsorEvent {
  sponsorId: string;
  eventId: string;
  packageId: string;
  contributionAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  benefitsDelivered: string[];
  analytics: {
    impressions: number;
    engagement: number;
    roi: number;
  };
}
```

### 2. API Service
```typescript
// services/sponsorService.ts
export const sponsorService = {
  async getSponsors(params: {
    tier?: string;
    status?: string;
  }) {
    const { tier, status = 'active' } = params;
    const query = supabase
      .from('sponsors')
      .select('*')
      .eq('status', status);

    if (tier) {
      query.eq('tier', tier);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Sponsor[];
  },

  async getSponsorPackages() {
    const { data, error } = await supabase
      .from('sponsorship_packages')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;
    return data as SponsorPackage[];
  },

  async getSponsorAnalytics(sponsorId: string) {
    const { data, error } = await supabase
      .from('sponsor_events')
      .select('analytics')
      .eq('sponsor_id', sponsorId);

    if (error) throw error;
    return data;
  }
};
```

## Testing & Deployment

### 1. Component Testing
```typescript
// __tests__/components/SponsorCard.test.tsx
describe('SponsorCard', () => {
  const mockSponsor = {
    id: '1',
    name: 'Test Sponsor',
    tier: 'gold',
    logoUrl: '/test-logo.png'
  };

  it('renders sponsor details correctly', () => {
    render(<SponsorCard sponsor={mockSponsor} />);
    expect(screen.getByText('Test Sponsor')).toBeInTheDocument();
    expect(screen.getByAltText('Test Sponsor logo')).toHaveAttribute('src', '/test-logo.png');
  });
});
```

### 2. Integration Testing
```typescript
// cypress/e2e/sponsors.cy.ts
describe('Sponsors Page', () => {
  beforeEach(() => {
    cy.visit('/sponsors');
  });

  it('displays sponsor packages', () => {
    cy.get('[data-testid="package-card"]').should('have.length.gt', 0);
  });

  it('filters sponsors by tier', () => {
    cy.get('[data-testid="tier-filter"]').click();
    cy.get('[data-testid="tier-option-gold"]').click();
    cy.get('[data-testid="sponsor-card"]').should('exist');
  });
});
```

### 3. Deployment Checklist
- [ ] Verify all sponsor images are optimized
- [ ] Check sponsor data integrity
- [ ] Test package calculations
- [ ] Verify analytics tracking
- [ ] Test email notifications
- [ ] Check mobile responsiveness
- [ ] Deploy to staging
- [ ] Verify all sponsor tiers
- [ ] Monitor analytics

## Performance Optimization

### 1. Image Optimization
- Implement lazy loading for sponsor logos
- Use WebP format with fallbacks
- Implement responsive images
- Cache sponsor assets
- Optimize logo delivery

### 2. Data Management
- Cache sponsor data
- Implement real-time updates
- Optimize analytics queries
- Use incremental static regeneration
- Implement data prefetching

### 3. User Experience
- Add loading states
- Implement error boundaries
- Add retry mechanisms
- Optimize form submissions
- Implement progressive enhancement 