# Preview Modal & Loader Implementation

## Changes Made

### 1. CreateCard.jsx Updates
- Added `isPreviewLoading` state to track preview generation status
- Updated `handlePreview()` to show loader while generating preview
- Added 300ms delay for better UX (allows loader to be visible even on fast networks)
- Updated loader condition to show for both saving and preview operations
- Passed `isModal={true}` to CardPreview component

```jsx
const [isPreviewLoading, setIsPreviewLoading] = useState(false);

const handlePreview = async () => {
  if (!await validate()) {
    return;
  }
  setIsPreviewLoading(true);
  setLoadingMessage("Generating preview...");
  setTimeout(() => {
    setShowPreview(true);
    setIsPreviewLoading(false);
  }, 300);
};

// Loader shows for both saving and preview
{(isSaving || isPreviewLoading) && <Loader message={loadingMessage} />}
```

### 2. CardPreview.jsx Updates
- Simplified return statement to always render as modal
- Removed full-page rendering logic
- Removed unused `isModal` prop check in JSX (component always renders as modal)

```jsx
return (
  <div className="preview-modal-overlay">
    <div className="preview-modal">
      {/* Actions and content */}
    </div>
  </div>
);
```

### 3. Card.css Styling Updates

#### Modal Overlay
- Fixed position overlay with semi-transparent dark background (rgba(0,0,0,0.6))
- Centered on screen using flexbox
- Fade-in animation (0.3s ease-out)
- Z-index 9999 (above all other content)

```css
.preview-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease-out;
}

.preview-modal {
  background: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}
```

#### Animations
- `fadeIn`: Background fade from transparent to dark (0.3s)
- `slideUp`: Modal slides up from bottom with fade (0.3s)

#### Mobile Responsive
- Modal max-width: 95vw (prevents edge cutoff)
- Modal max-height: 85vh (more space on smaller screens)
- Padding reduced to 15px for mobile
- Preview wrapper switches to column layout for stacked cards

## User Experience Improvements

### Before
- Preview appeared instantly without visual feedback
- Rendered as full-page replacing the form
- User couldn't see it was loading

### After
- Loader displays "Generating preview..." for 300ms
- Preview appears as modal overlay (dark background, centered)
- User can see the loader and understand what's happening
- Form remains accessible behind the modal
- Close button returns to form without losing data
- Modal is smooth with animations (fade and slide-up)

## Technical Details

### Loader Timing
- 300ms delay ensures loader is visible even on fast machines
- Improves perceived performance and user feedback
- Prevents "flashing" on very fast networks

### Modal Styling
- Semi-transparent background (40% opacity) shows form behind
- White card with shadow creates depth
- Animations provide visual feedback
- Responsive sizing handles all screen sizes

### Z-index Stack
- Notification container: 9998
- Preview modal: 9999 (above notifications)
- Loader backdrop: Inherits from Loader component

## Testing Checklist

- [ ] Click "Preview Card" with empty fields → Validation notifications appear
- [ ] Fill form and click "Preview Card" → Loader shows "Generating preview..."
- [ ] Preview modal appears centered with dark background overlay
- [ ] Cards display correctly in modal
- [ ] Can scroll within modal if content overflows
- [ ] Click "Close" button → Modal closes, form data preserved
- [ ] Click "Download PDF" → PDF downloads correctly
- [ ] Test on mobile (768px) → Modal scales properly
- [ ] Test on small mobile (480px) → Cards stack vertically
