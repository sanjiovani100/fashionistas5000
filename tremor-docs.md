# Tremor Documentation

## Introduction

Tremor is a React library that provides a comprehensive suite of components for building dashboards and data visualization interfaces. It offers a collection of fully-styled and customizable components that make it easy to create beautiful, responsive, and interactive data-driven applications.

## Installation and Setup

### Prerequisites

- Node.js 14.x or higher
- React 17.x or higher

### Installation

You can install Tremor using npm, yarn, or pnpm:

```bash
# Using npm
npm install @tremor/react

# Using yarn
yarn add @tremor/react

# Using pnpm
pnpm add @tremor/react
```

### Tailwind CSS Setup

Tremor is built on top of Tailwind CSS, so you need to configure Tailwind CSS in your project:

1. Install Tailwind CSS if you haven't already:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Add Tremor to your Tailwind CSS configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

3. Import Tremor styles in your CSS file:

```css
/* In your global CSS file */
@import '@tremor/react/dist/tremor.css';
```

## Core Concepts

### Design Principles

Tremor follows these core design principles:

1. **Simplicity**: Components are designed to be easy to use and understand.
2. **Flexibility**: Components can be customized to fit your specific needs.
3. **Consistency**: Components follow a consistent design language.
4. **Performance**: Components are optimized for performance.

### Component Structure

Tremor components are organized into several categories:

1. **Layout Components**: For structuring your dashboard (Card, Grid, Flex, etc.)
2. **Data Display Components**: For displaying data (Text, Metric, ProgressBar, etc.)
3. **Chart Components**: For visualizing data (BarChart, LineChart, DonutChart, etc.)
4. **Input Components**: For user interaction (Select, DateRangePicker, etc.)
5. **Utility Components**: For additional functionality (Color, Tooltip, etc.)

## Component Categories

### Layout Components

#### Card

The Card component is a container that groups related content and actions.

```jsx
import { Card, Text } from '@tremor/react';

<Card>
  <Text>This is a card</Text>
</Card>
```

#### Grid

The Grid component creates a responsive grid layout.

```jsx
import { Grid, Card } from '@tremor/react';

<Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Grid>
```

### Data Display Components

#### Text

The Text component displays text with different styles.

```jsx
import { Text } from '@tremor/react';

<Text>Default text</Text>
<Text color="blue">Blue text</Text>
<Text size="xl">Extra large text</Text>
```

#### Metric

The Metric component displays a key metric with an optional label and description.

```jsx
import { Metric } from '@tremor/react';

<Metric>$12,699</Metric>
```

### Chart Components

#### BarChart

The BarChart component displays data as horizontal or vertical bars.

```jsx
import { BarChart } from '@tremor/react';

const data = [
  {
    name: 'Product A',
    sales: 57,
  },
  {
    name: 'Product B',
    sales: 86,
  },
];

<BarChart
  data={data}
  index="name"
  categories={["sales"]}
  colors={["blue"]}
  yAxisWidth={48}
/>
```

#### LineChart

The LineChart component displays data as points connected by straight lines.

```jsx
import { LineChart } from '@tremor/react';

const data = [
  {
    date: 'Jan 2023',
    'Product A': 100,
    'Product B': 150,
  },
  {
    date: 'Feb 2023',
    'Product A': 120,
    'Product B': 140,
  },
];

<LineChart
  data={data}
  index="date"
  categories={["Product A", "Product B"]}
  colors={["blue", "red"]}
  yAxisWidth={40}
/>
```

#### DonutChart

The DonutChart component displays data as a donut chart.

```jsx
import { DonutChart } from '@tremor/react';

const data = [
  {
    name: 'Product A',
    sales: 57,
  },
  {
    name: 'Product B',
    sales: 86,
  },
];

<DonutChart
  data={data}
  category="sales"
  index="name"
  colors={["blue", "red"]}
/>
```

### Input Components

#### Select

The Select component allows users to select an option from a dropdown menu.

```jsx
import { Select, SelectItem } from '@tremor/react';
import { useState } from 'react';

const [value, setValue] = useState("");

<Select value={value} onValueChange={setValue}>
  <SelectItem value="option1">Option 1</SelectItem>
  <SelectItem value="option2">Option 2</SelectItem>
  <SelectItem value="option3">Option 3</SelectItem>
</Select>
```

#### DateRangePicker

The DateRangePicker component allows users to select a date range.

```jsx
import { DateRangePicker } from '@tremor/react';
import { useState } from 'react';

const [value, setValue] = useState({
  from: new Date(2023, 0, 1),
  to: new Date(),
});

<DateRangePicker value={value} onValueChange={setValue} />
```

## Customization and Theming

### Colors

Tremor provides a set of predefined colors that you can use in your components:

- blue
- cyan
- green
- indigo
- orange
- pink
- purple
- red
- rose
- slate
- yellow

You can use these colors in most Tremor components:

```jsx
<Text color="blue">Blue text</Text>
<Card decoration="top" decorationColor="red">Card with red decoration</Card>
```

### Custom Theme

You can customize the Tremor theme by extending the Tailwind CSS configuration:

```javascript
// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          // ... other color definitions
        },
      },
    },
  },
  plugins: [],
};
```

## Best Practices

### Performance Optimization

1. **Memoize Components**: Use React.memo for components that render frequently.
2. **Optimize Data**: Process and filter data before passing it to chart components.
3. **Lazy Loading**: Use dynamic imports to load components only when needed.

### Accessibility

1. **Provide Alt Text**: Always provide alt text for visual elements.
2. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible.
3. **Color Contrast**: Ensure sufficient color contrast for text and visual elements.

### Responsive Design

1. **Use Grid Components**: Utilize Tremor's Grid component for responsive layouts.
2. **Responsive Props**: Use responsive props like numItemsSm, numItemsMd, etc.
3. **Mobile-First Approach**: Design for mobile first, then enhance for larger screens.

## Examples

### Dashboard Example

```jsx
import { Card, Grid, Metric, Text, Title, BarChart, LineChart } from '@tremor/react';

const salesData = [
  {
    date: 'Jan 2023',
    sales: 2890,
    profit: 1230,
  },
  // ... more data
];

function Dashboard() {
  return (
    <div className="p-4">
      <Title>Sales Dashboard</Title>
      
      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-4 mt-4">
        <Card>
          <Text>Revenue</Text>
          <Metric>$12,699</Metric>
        </Card>
        <Card>
          <Text>Profit</Text>
          <Metric>$5,430</Metric>
        </Card>
        <Card>
          <Text>Customers</Text>
          <Metric>1,234</Metric>
        </Card>
      </Grid>
      
      <Grid numItems={1} numItemsLg={2} className="gap-4 mt-4">
        <Card>
          <Title>Sales Over Time</Title>
          <LineChart
            data={salesData}
            index="date"
            categories={["sales", "profit"]}
            colors={["blue", "green"]}
            yAxisWidth={48}
            className="mt-4 h-80"
          />
        </Card>
        <Card>
          <Title>Sales by Category</Title>
          <BarChart
            data={categoryData}
            index="category"
            categories={["sales"]}
            colors={["blue"]}
            yAxisWidth={48}
            className="mt-4 h-80"
          />
        </Card>
      </Grid>
    </div>
  );
}
```

## Resources

- [Official Documentation](https://tremor.so/docs)
- [GitHub Repository](https://github.com/tremorlabs/tremor)
- [Examples Gallery](https://tremor.so/docs/examples)
- [Community Discord](https://discord.gg/tremor)

## Troubleshooting

### Common Issues

1. **Component Not Rendering**: Ensure you've imported the component correctly and provided all required props.
2. **Styling Issues**: Make sure you've configured Tailwind CSS correctly and imported Tremor styles.
3. **Data Visualization Issues**: Check that your data format matches what the component expects.

### Getting Help

If you encounter issues not covered in this documentation, you can:

1. Check the [official documentation](https://tremor.so/docs)
2. Search for issues on [GitHub](https://github.com/tremorlabs/tremor/issues)
3. Ask for help on [Discord](https://discord.gg/tremor)
4. Post a question on [Stack Overflow](https://stackoverflow.com/questions/tagged/tremor) 