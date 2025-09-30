# TipTap Float Architecture - Block Nodes with Text Wrapping

## The Core Problem

You identified the real issue: **Image and text are separate block nodes in TipTap's document structure.**

### TipTap Document Structure
```
Document
├─ Paragraph (block)
│  └─ "Some text"
├─ Image Node (block)
│  └─ Image component
└─ Paragraph (block)
   └─ "More text"
```

Each is a separate block, so by default they stack vertically instead of wrapping.

## Why We Keep Block Nodes

We keep images as **block nodes** (not inline) because:

1. ✅ **Better control** - Block nodes can be selected, dragged, deleted independently
2. ✅ **Resize handles** - Easier to implement on block nodes
3. ✅ **Float controls** - Float is a block-level CSS property
4. ✅ **Node views** - React components work better as block nodes

## The Solution: CSS Float Across Blocks

CSS floats work **across block boundaries** in HTML. A floated element in one block can have text from subsequent blocks wrap around it.

### HTML Structure
```html
<div class="node-image">           <!-- Block 1 -->
  <div class="image-wrapper" style="float: left">
    <img />
  </div>
</div>
<p>Text that wraps around</p>      <!-- Block 2 -->
```

Even though they're separate blocks, the float causes text to wrap!

## CSS Strategy

### 1. Make node-image Not Take Full Width
```css
.ProseMirror .node-image {
  display: inline-block !important;
  width: auto !important;
  clear: none !important;
}
```

When not floated, the image node only takes the space it needs.

### 2. When Floated, Make It Block
```css
.ProseMirror .node-image:has(.image-wrapper[style*="float: left"]) {
  display: block !important;
  clear: none !important;
}
```

When the image inside is floated, the wrapper becomes block-level to allow proper float behavior.

### 3. Prevent Paragraphs from Clearing
```css
.ProseMirror .node-image + p,
.ProseMirror .node-image ~ p {
  clear: none !important;
}
```

Ensures subsequent paragraphs don't clear the float and can wrap around it.

## How CSS Float Works Across Blocks

### Normal Block Stacking (No Float)
```
┌─────────────────┐
│  Block 1        │
└─────────────────┘
┌─────────────────┐
│  Block 2        │
└─────────────────┘
```

### With Float
```
┌──────┐  Block 2 text wraps
│Block1│  around the floated
│Float │  Block 1 element
└──────┘  naturally
```

The float is removed from normal flow, so Block 2 can flow around it!

## TipTap Node Configuration

```typescript
export const ImageExtension = Node.create<ImageOptions>({
  name: "image",
  
  inline() {
    return false;  // Block node
  },
  
  group() {
    return "block";  // Part of block group
  },
  
  atom: true,  // Treated as single unit (can't edit inside)
  draggable: true,  // Can be dragged
});
```

### Why atom: true?
- Makes the image a single, indivisible unit
- Can't place cursor inside the image
- Better for drag-and-drop behavior
- Cleaner selection model

## Alternative Approach: Inline Nodes

We could make images inline nodes:

```typescript
inline() {
  return true;
}

group() {
  return "inline";
}
```

### Pros of Inline
- ✅ Image and text in same paragraph
- ✅ Natural text wrapping
- ✅ Simpler structure

### Cons of Inline
- ❌ Harder to implement resize handles
- ❌ Float doesn't work well with inline elements
- ❌ Selection and dragging more complex
- ❌ Can't have image-only lines easily

## Why Block + Float Is Better

1. **Flexibility**: Can have image alone OR with text
2. **Control**: Better resize, drag, select behavior
3. **Float Power**: CSS float is designed for this
4. **React Node Views**: Easier to implement custom components

## The :has() Selector

```css
.node-image:has(.image-wrapper[style*="float: left"]) {
  /* Styles when image inside is floated left */
}
```

The `:has()` pseudo-class lets us style the parent based on child state:
- Checks if `.image-wrapper` inside has `float: left` in its style
- Applies styles to `.node-image` accordingly
- Modern CSS feature (well-supported now)

## Browser Compatibility

### :has() Support
- ✅ Chrome 105+
- ✅ Safari 15.4+
- ✅ Firefox 121+
- ✅ Edge 105+

For older browsers, the image will still work, just might not wrap as perfectly.

## Fallback for Older Browsers

If `:has()` isn't supported, we can use JavaScript:

```typescript
// In ResizableImageComponent
useEffect(() => {
  const nodeImage = imageRef.current?.closest('.node-image');
  if (nodeImage && float !== 'none') {
    nodeImage.classList.add('has-float');
  } else {
    nodeImage?.classList.remove('has-float');
  }
}, [float]);
```

Then in CSS:
```css
.ProseMirror .node-image.has-float {
  display: block !important;
}
```

## Testing the Float Behavior

### Test 1: Float Left
1. Insert image
2. Set float to left
3. Add text in next paragraph
4. **Expected**: Text wraps around right side of image
5. **Result**: ✅ Works!

### Test 2: Resize While Floating
1. Float image left
2. Drag resize handle
3. **Expected**: Text reflows as image resizes
4. **Result**: ✅ Works!

### Test 3: Remove Float
1. Float image left (text wrapping)
2. Set float to none
3. **Expected**: Image becomes inline-block, text below
4. **Result**: ✅ Works!

## Key Takeaways

1. **Block nodes CAN have text wrap** using CSS float
2. **:has() selector** enables parent styling based on child state
3. **clear: none** is critical for text wrapping
4. **display: inline-block** when not floated keeps image compact
5. **display: block** when floated allows proper float behavior
6. **atom: true** makes image a single, draggable unit

## Summary

We solved the "separate nodes" problem not by combining them, but by using CSS float's ability to work across block boundaries. This gives us the best of both worlds:
- Block node benefits (resize, drag, select)
- Text wrapping benefits (float behavior)
- Clean TipTap document structure
- Professional magazine-style layouts
