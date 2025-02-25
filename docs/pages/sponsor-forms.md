# Sponsor Forms Setup Guide

## Quick Links
- [Overview](#overview)
- [Form Requirements](#form-requirements)
- [Multi-Step Form Structure](#multi-step-form-structure)
- [Data Validation](#data-validation)
- [UI Components](#ui-components)
- [Integration Points](#integration-points)

## Overview

The sponsor forms system is a crucial component of the Fashionista Portal, designed to streamline the sponsor onboarding process through a multi-step, user-friendly interface.

### Key Features
- Multi-step form progression
- Real-time validation
- File upload capabilities
- Dynamic pricing calculator
- Progress saving
- Mobile responsiveness

## Form Requirements

### Technical Requirements
```typescript
interface SponsorFormData {
  // Step 1: Basic Information
  companyInfo: {
    companyName: string;
    website: string;
    industry: string;
    companySize: string;
    yearFounded: number;
    registrationNumber?: string;
  };
  
  // Step 2: Contact Details
  contactInfo: {
    primaryContact: {
      name: string;
      position: string;
      email: string;
      phone: string;
    };
    alternateContact?: {
      name: string;
      position: string;
      email: string;
      phone: string;
    };
  };
  
  // Step 3: Brand Assets
  brandAssets: {
    logo: File;
    brandColors: string[];
    brandGuidelines?: File;
    marketingMaterials?: File[];
  };
  
  // Step 4: Sponsorship Preferences
  sponsorshipPreferences: {
    targetEvents: string[];
    budgetRange: string;
    sponsorshipGoals: string[];
    previousSponsorships?: {
      eventName: string;
      year: number;
      impact: string;
    }[];
  };
  
  // Step 5: Legal & Compliance
  legalInfo: {
    termsAccepted: boolean;
    privacyPolicyAccepted: boolean;
    taxNumber?: string;
    vatRegistered: boolean;
    authorizedSignatory: string;
  };
}
```

### Validation Rules
```typescript
const validationRules = {
  companyInfo: {
    companyName: { required: true, minLength: 2, maxLength: 100 },
    website: { required: true, pattern: /^https?:\/\/.+/ },
    industry: { required: true },
    companySize: { required: true },
    yearFounded: { required: true, min: 1800, max: new Date().getFullYear() }
  },
  contactInfo: {
    primaryContact: {
      name: { required: true, minLength: 2, maxLength: 100 },
      position: { required: true },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      phone: { required: true, pattern: /^\+?[\d\s-]{8,}$/ }
    }
  },
  brandAssets: {
    logo: { required: true, maxSize: 5242880, types: ['image/jpeg', 'image/png', 'image/svg+xml'] }
  },
  sponsorshipPreferences: {
    targetEvents: { required: true, minLength: 1 },
    budgetRange: { required: true },
    sponsorshipGoals: { required: true, minLength: 1 }
  },
  legalInfo: {
    termsAccepted: { required: true, value: true },
    privacyPolicyAccepted: { required: true, value: true },
    authorizedSignatory: { required: true }
  }
};
```

## Multi-Step Form Structure

### Step 1: Company Information
**Purpose:** Collect essential company details and business information.

**Form Fields:**
```html
<form>
  <section id="company-info">
    <h2>Company Information</h2>
    
    <div class="form-group">
      <label for="companyName">Company Name*</label>
      <input type="text" id="companyName" required />
      <span class="helper-text">Legal registered name of your company</span>
    </div>
    
    <div class="form-group">
      <label for="website">Company Website*</label>
      <input type="url" id="website" required />
      <span class="helper-text">Must include https:// or http://</span>
    </div>
    
    <div class="form-group">
      <label for="industry">Industry*</label>
      <select id="industry" required>
        <option value="">Select Industry</option>
        <option value="fashion">Fashion & Apparel</option>
        <option value="beauty">Beauty & Cosmetics</option>
        <option value="luxury">Luxury Goods</option>
        <option value="retail">Retail</option>
        <option value="technology">Technology</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-group">
      <label for="companySize">Company Size*</label>
      <select id="companySize" required>
        <option value="">Select Company Size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="501+">501+ employees</option>
      </select>
    </div>

    <div class="form-group">
      <label for="yearFounded">Year Founded*</label>
      <input type="number" id="yearFounded" required min="1800" max="2024" />
    </div>

    <div class="form-group">
      <label for="registrationNumber">Registration Number</label>
      <input type="text" id="registrationNumber" />
      <span class="helper-text">Company registration/tax ID number (if applicable)</span>
    </div>
  </section>
</form>
```

### Step 2: Contact Information
**Purpose:** Gather primary and secondary contact details for communication.

**Form Fields:**
```html
<section id="contact-info">
  <h2>Contact Information</h2>
  
  <!-- Primary Contact -->
  <div class="contact-section">
    <h3>Primary Contact</h3>
    
    <div class="form-group">
      <label for="primaryName">Full Name*</label>
      <input type="text" id="primaryName" required />
    </div>
    
    <div class="form-group">
      <label for="primaryPosition">Position*</label>
      <input type="text" id="primaryPosition" required />
    </div>
    
    <div class="form-group">
      <label for="primaryEmail">Email*</label>
      <input type="email" id="primaryEmail" required />
    </div>
    
    <div class="form-group">
      <label for="primaryPhone">Phone Number*</label>
      <input type="tel" id="primaryPhone" required />
      <span class="helper-text">Include country code (e.g., +1)</span>
    </div>
  </div>

  <!-- Alternate Contact -->
  <div class="contact-section">
    <h3>Alternate Contact (Optional)</h3>
    
    <div class="form-group">
      <label for="alternateName">Full Name</label>
      <input type="text" id="alternateName" />
    </div>
    
    <div class="form-group">
      <label for="alternatePosition">Position</label>
      <input type="text" id="alternatePosition" />
    </div>
    
    <div class="form-group">
      <label for="alternateEmail">Email</label>
      <input type="email" id="alternateEmail" />
    </div>
    
    <div class="form-group">
      <label for="alternatePhone">Phone Number</label>
      <input type="tel" id="alternatePhone" />
    </div>
  </div>

  <!-- Communication Preferences -->
  <div class="preferences-section">
    <h3>Communication Preferences</h3>
    
    <div class="form-group">
      <label for="preferredContact">Preferred Contact Method*</label>
      <select id="preferredContact" required>
        <option value="email">Email</option>
        <option value="phone">Phone</option>
        <option value="whatsapp">WhatsApp</option>
      </select>
    </div>
    
    <div class="form-group">
      <label>
        <input type="checkbox" id="marketingConsent" />
        Receive marketing communications
      </label>
    </div>
  </div>
</section>
```

### Step 3: Brand Assets
**Purpose:** Collect brand materials and visual assets.

**Form Fields:**
```html
<section id="brand-assets">
  <h2>Brand Assets</h2>

  <!-- Logo Upload -->
  <div class="form-group">
    <label for="logo">Company Logo*</label>
    <input type="file" 
           id="logo" 
           accept="image/png,image/jpeg,image/svg+xml" 
           required />
    <span class="helper-text">
      Maximum size: 5MB. Formats: PNG, JPG, SVG
      Recommended size: 500x500px
    </span>
  </div>

  <!-- Brand Colors -->
  <div class="form-group">
    <label>Brand Colors*</label>
    <div class="color-picker-group">
      <input type="color" id="primaryColor" required />
      <label for="primaryColor">Primary</label>
      
      <input type="color" id="secondaryColor" />
      <label for="secondaryColor">Secondary</label>
      
      <input type="color" id="accentColor" />
      <label for="accentColor">Accent</label>
    </div>
  </div>

  <!-- Brand Guidelines -->
  <div class="form-group">
    <label for="brandGuidelines">Brand Guidelines</label>
    <input type="file" 
           id="brandGuidelines" 
           accept=".pdf,.doc,.docx" />
    <span class="helper-text">
      Maximum size: 10MB. Formats: PDF, DOC, DOCX
    </span>
  </div>

  <!-- Marketing Materials -->
  <div class="form-group">
    <label for="marketingMaterials">Marketing Materials</label>
    <input type="file" 
           id="marketingMaterials" 
           accept=".pdf,.jpg,.png,.zip" 
           multiple />
    <span class="helper-text">
      Maximum size: 20MB total. Formats: PDF, JPG, PNG, ZIP
    </span>
  </div>
</section>
```

### Step 4: Sponsorship Preferences
**Purpose:** Define sponsorship goals, budget, and preferences.

**Form Fields:**
```html
<section id="sponsorship-preferences">
  <h2>Sponsorship Preferences</h2>

  <!-- Target Events -->
  <div class="form-group">
    <label>Target Events*</label>
    <div class="checkbox-group">
      <label>
        <input type="checkbox" name="targetEvents" value="fashion-week" />
        Fashion Week Shows
      </label>
      <label>
        <input type="checkbox" name="targetEvents" value="designer-showcase" />
        Designer Showcases
      </label>
      <label>
        <input type="checkbox" name="targetEvents" value="trunk-shows" />
        Trunk Shows
      </label>
      <label>
        <input type="checkbox" name="targetEvents" value="pop-up-events" />
        Pop-up Events
      </label>
    </div>
  </div>

  <!-- Budget Range -->
  <div class="form-group">
    <label for="budgetRange">Sponsorship Budget Range*</label>
    <select id="budgetRange" required>
      <option value="">Select Budget Range</option>
      <option value="5000-10000">$5,000 - $10,000</option>
      <option value="10001-25000">$10,001 - $25,000</option>
      <option value="25001-50000">$25,001 - $50,000</option>
      <option value="50001-100000">$50,001 - $100,000</option>
      <option value="100001+">$100,001+</option>
    </select>
  </div>

  <!-- Sponsorship Goals -->
  <div class="form-group">
    <label>Sponsorship Goals*</label>
    <div class="checkbox-group">
      <label>
        <input type="checkbox" name="goals" value="brand-awareness" />
        Brand Awareness
      </label>
      <label>
        <input type="checkbox" name="goals" value="lead-generation" />
        Lead Generation
      </label>
      <label>
        <input type="checkbox" name="goals" value="sales-increase" />
        Sales Increase
      </label>
      <label>
        <input type="checkbox" name="goals" value="market-entry" />
        Market Entry
      </label>
      <label>
        <input type="checkbox" name="goals" value="networking" />
        Industry Networking
      </label>
    </div>
  </div>

  <!-- Previous Sponsorships -->
  <div class="form-group">
    <h3>Previous Sponsorships</h3>
    <button type="button" class="add-sponsorship">+ Add Previous Sponsorship</button>
    
    <div class="previous-sponsorship">
      <input type="text" placeholder="Event Name" />
      <input type="number" placeholder="Year" min="2000" max="2024" />
      <textarea placeholder="Impact/Results"></textarea>
    </div>
  </div>
</section>
```

### Step 5: Legal & Compliance
**Purpose:** Ensure legal compliance and agreement to terms.

**Form Fields:**
```html
<section id="legal-compliance">
  <h2>Legal & Compliance</h2>

  <!-- Terms & Conditions -->
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox" id="termsAccepted" required />
      I accept the Terms & Conditions*
    </label>
    <a href="/terms" target="_blank">View Terms & Conditions</a>
  </div>

  <!-- Privacy Policy -->
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox" id="privacyPolicyAccepted" required />
      I accept the Privacy Policy*
    </label>
    <a href="/privacy" target="_blank">View Privacy Policy</a>
  </div>

  <!-- Tax Information -->
  <div class="form-group">
    <label for="taxNumber">Tax Number</label>
    <input type="text" id="taxNumber" />
    <span class="helper-text">VAT/GST number if applicable</span>
  </div>

  <!-- VAT Registration -->
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox" id="vatRegistered" />
      Company is VAT registered
    </label>
  </div>

  <!-- Authorized Signatory -->
  <div class="form-group">
    <label for="authorizedSignatory">Authorized Signatory Name*</label>
    <input type="text" id="authorizedSignatory" required />
    <span class="helper-text">Person authorized to sign legal documents</span>
  </div>

  <!-- Digital Signature -->
  <div class="form-group">
    <label for="signature">Digital Signature*</label>
    <div class="signature-pad"></div>
    <button type="button" class="clear-signature">Clear Signature</button>
  </div>

  <!-- Declaration -->
  <div class="form-group">
    <label class="checkbox-label">
      <input type="checkbox" id="declaration" required />
      I declare that all information provided is true and accurate*
    </label>
  </div>
</section>
```

## Data Validation

### Client-Side Validation
```typescript
const validateStep = (step: number, data: Partial<SponsorFormData>): ValidationResult => {
  const errors: ValidationErrors = {};
  
  switch(step) {
    case 1:
      if (!data.companyInfo?.companyName) {
        errors.companyName = 'Company name is required';
      }
      // Additional validation
      break;
    
    case 2:
      if (!data.contactInfo?.primaryContact.email) {
        errors.email = 'Email is required';
      }
      // Additional validation
      break;
    
    // Additional steps
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

### Server-Side Validation
```typescript
const validateSubmission = async (data: SponsorFormData): Promise<ValidationResult> => {
  // Comprehensive validation
  const errors: ValidationErrors = {};
  
  // Company validation
  if (await isDuplicateCompany(data.companyInfo.companyName)) {
    errors.companyName = 'Company already registered';
  }
  
  // Email validation
  if (await isDuplicateEmail(data.contactInfo.primaryContact.email)) {
    errors.email = 'Email already in use';
  }
  
  // Additional validation
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

## UI Components

### Progress Indicator
```typescript
interface ProgressStep {
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: string;
}

const formSteps: ProgressStep[] = [
  { label: 'Company Info', status: 'current', icon: 'building' },
  { label: 'Contact Details', status: 'upcoming', icon: 'user' },
  { label: 'Brand Assets', status: 'upcoming', icon: 'image' },
  { label: 'Preferences', status: 'upcoming', icon: 'star' },
  { label: 'Legal', status: 'upcoming', icon: 'file-contract' }
];
```

### Form Navigation
```typescript
interface FormNavigation {
  canProceed: boolean;
  canGoBack: boolean;
  currentStep: number;
  totalSteps: number;
}

const navigationControls = {
  next: () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep(prev => prev + 1);
    }
  },
  previous: () => {
    setCurrentStep(prev => prev - 1);
  },
  save: () => {
    saveProgress(formData);
  }
};
```

## Integration Points

### API Endpoints
```typescript
interface SponsorAPI {
  endpoints: {
    submit: '/api/sponsors/submit';
    validate: '/api/sponsors/validate';
    upload: '/api/sponsors/upload';
    save: '/api/sponsors/save-progress';
  };
  methods: {
    submit: 'POST';
    validate: 'POST';
    upload: 'POST';
    save: 'PUT';
  };
}
```

### Database Schema
```sql
CREATE TABLE sponsor_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_info JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  brand_assets JSONB NOT NULL,
  preferences JSONB NOT NULL,
  legal_info JSONB NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES users(id)
);
```

Remember:
- All fields marked with * are required
- Implement proper error handling for each step
- Add loading states during file uploads
- Include form persistence between steps
- Ensure mobile responsiveness
- Maintain accessibility standards
- Monitor form completion analytics
- Track form abandonment rates

Need Help?
- Contact support team
- Review documentation
- Check error logs
- Submit bug reports
- Request features
- Share feedback 