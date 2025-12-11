# LoadingSpinner Component

A reusable, animated loading component for the Stratify application with multiple animation styles.

## Features

- 🎨 **5 Animation Variants**: spinner, dots, pulse, bars, ring
- 📏 **3 Size Options**: small, medium, large
- 🎨 **Customizable Colors**: Match your brand colors
- 🖥️ **Fullscreen Mode**: Optional overlay for page-level loading
- 📝 **Loading Text**: Optional text message below animation

## Usage

### Basic Import

```tsx
import { LoadingSpinner } from "@/shared/components/Loading";
```

### Examples

#### 1. Default Spinner (Medium size, green color)
```tsx
<LoadingSpinner />
```

#### 2. Dots Animation with Custom Color
```tsx
<LoadingSpinner 
  variant="dots" 
  color="#3b3b3b" 
/>
```

#### 3. Large Pulse Animation
```tsx
<LoadingSpinner 
  variant="pulse" 
  size="large" 
  color="#009063" 
/>
```

#### 4. Fullscreen Loading with Text
```tsx
<LoadingSpinner 
  variant="spinner" 
  fullScreen={true} 
  text="Loading your data..." 
  color="#009063"
/>
```

#### 5. Small Bars for Inline Loading
```tsx
<LoadingSpinner 
  variant="bars" 
  size="small" 
/>
```

#### 6. Ring Animation
```tsx
<LoadingSpinner 
  variant="ring" 
  size="medium" 
  color="#009063"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"spinner" \| "dots" \| "pulse" \| "bars" \| "ring"` | `"spinner"` | Animation style |
| `size` | `"small" \| "medium" \| "large"` | `"medium"` | Size of the loader |
| `color` | `string` | `"#009063"` | Color of the animation |
| `fullScreen` | `boolean` | `false` | Show as fullscreen overlay |
| `text` | `string` | `undefined` | Optional loading text |

## Common Use Cases

### 1. Page Loading State
```tsx
const MyPage = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return (
      <LoadingSpinner 
        fullScreen={true} 
        text="Loading page..." 
      />
    );
  }

  return <div>Page Content</div>;
};
```

### 2. Button Loading State
```tsx
const MyButton = () => {
  const [loading, setLoading] = useState(false);

  return (
    <button disabled={loading}>
      {loading ? (
        <LoadingSpinner variant="dots" size="small" color="#ffffff" />
      ) : (
        "Submit"
      )}
    </button>
  );
};
```

### 3. Data Fetching
```tsx
const DataComponent = () => {
  const { data, isLoading } = useQuery('data', fetchData);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <LoadingSpinner 
          variant="pulse" 
          text="Fetching data..." 
        />
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
};
```

### 4. Card/Section Loading
```tsx
const MyCard = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="card">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <LoadingSpinner variant="ring" />
        </div>
      ) : (
        <div>Card Content</div>
      )}
    </div>
  );
};
```

## Animation Variants

- **spinner**: Classic rotating circle (best for general use)
- **dots**: Three bouncing dots (great for buttons and inline loading)
- **pulse**: Pulsing circle (smooth and subtle)
- **bars**: Four stretching bars (modern and dynamic)
- **ring**: Rotating rings (elegant and eye-catching)

## Styling Notes

- All animations use CSS keyframes for smooth performance
- Fullscreen mode includes a subtle backdrop blur
- Colors are fully customizable via props
- Animations are optimized for 60fps performance
