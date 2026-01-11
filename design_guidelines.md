# Driim Design Guidelines

## Brand Identity

**Purpose**: Driim helps users capture, organize, and reflect on their dreams immediately upon waking. It's a personal sanctuary for nocturnal memories.

**Aesthetic Direction**: **Nocturnal Serenity** - Soft, twilight-inspired with organic curves and gentle gradients. The app feels like a safe space between sleep and waking, not clinical or overly technical.

**Memorable Element**: Subtle gradient overlays that shift based on time of day (deeper indigo at night, soft lavender at dawn, warm amber at dusk). All interactive elements have smooth, dream-like micro-animations (300ms ease-out).

## Navigation Architecture

**Root Navigation**: Bottom Tab Bar (5 tabs)
- Journal (Home - list view with FAB)
- Search (magnifying glass icon)
- Insights (chart/stats icon)
- Calendar (calendar icon)
- Settings (gear icon)

**Core Action**: Quick Add Dream - Floating Action Button (FAB) on Journal tab, globally accessible via header button on other tabs.

## Screen-by-Screen Specifications

### 1. Journal (Home)
- **Header**: Transparent, centered title "Driim", right button = "+" (quick add)
- **Content**: Scrollable FlatList of dream cards
  - Card design: Rounded corners (16px), subtle gradient background based on lucidity level, title + date + emotion tags preview
  - Empty state: Centered illustration (moon with stars) + "Your dreams await"
- **Floating Element**: FAB bottom-right (60×60px circular, primary gradient, moon icon)
- **Safe Area**: Top = headerHeight + 16px, Bottom = tabBarHeight + 100px (space for FAB)

### 2. Dream Detail (Stack Modal)
- **Header**: Left = back, right = edit/delete menu, title = dream title (truncated)
- **Content**: ScrollView with sections:
  - Hero: Date/time badges, lucidity/clarity meters (horizontal progress bars)
  - Content block: Title (large), body text (generous line height)
  - Metadata grid: Emotions (pill badges), tags, people, places
  - Footer: "Reflect" button (secondary style, full-width)
- **Safe Area**: Standard (top/bottom 16px)

### 3. Dream Edit/Create (Stack Modal)
- **Header**: Left = cancel, right = save, title = "New Dream" or "Edit"
- **Content**: Scrollable form with autofocus on title
  - Template selector at top (3 pill buttons: Short/Detailed/Lucid)
  - Form fields: Title, date/time pickers, content textarea (multi-line), sliders for lucidity/clarity, emotion multi-select chips, tag input with autocomplete
- **Submit**: Header right button (always visible, disabled until title filled)
- **Safe Area**: Top = 16px, Bottom = keyboard-aware

### 4. Search
- **Header**: Search bar (not transparent), placeholder = "Search dreams..."
- **Content**: Filter section (collapsible) + results list
  - Filters: Date range picker, lucidity range, emotion checkboxes, tag selector
  - Results use same card design as Journal
- **Empty State**: "No dreams match your filters" with reset button
- **Safe Area**: Top = searchBarHeight + 16px, Bottom = tabBarHeight + 16px

### 5. Insights
- **Header**: Transparent, title "Insights", no buttons
- **Content**: ScrollView with stat cards
  - Streak card (large, gradient background, number + flame icon)
  - Charts: Simple bar chart (dreams/week), line chart (lucidity trend), tag cloud
  - Cards have rounded corners, spacing between = 16px
- **Safe Area**: Top = headerHeight + 16px, Bottom = tabBarHeight + 16px

### 6. Calendar
- **Header**: Month/year title (centered), left/right arrows for navigation
- **Content**: Custom month grid (7×6), dots on dream days (color = average lucidity)
  - Tap day = bottom sheet with dream list for that day
- **Safe Area**: Top = headerHeight + 16px, Bottom = tabBarHeight + 16px

### 7. Settings
- **Header**: Standard, title "Settings"
- **Content**: Grouped list (section headers)
  - Account: Avatar, name, sign out
  - Preferences: Dark mode, notifications, reminder times
  - Privacy: App lock toggle, encrypt dreams toggle
  - Data: Export, import, seed sample data
  - About: Version, privacy policy, terms
- **Safe Area**: Standard

### 8. Auth Screens (Stack - shown if not logged in)
- Sign In: Logo, email/password fields, Apple/Google SSO buttons, "Continue Offline" link
- Sign Up: Same layout, terms checkbox
- Minimal design, centered forms, soft backgrounds

## Color Palette

**Primary**: Deep Indigo → Soft Violet gradient (#4A3B8C → #7B68C4)
**Accent**: Warm Amber (#FFA94D) - used sparingly for highlights
**Background**: 
  - Light mode: Soft Lavender (#F5F3FF)
  - Dark mode: Deep Navy (#0F0E1A)
**Surface**: 
  - Light: White with 5% opacity overlay
  - Dark: #1A1825 with subtle gradient
**Text**: 
  - Light mode: #2D2640 (primary), #6B6380 (secondary)
  - Dark mode: #F5F3FF (primary), #A69FBD (secondary)
**Semantic**: Success (#6BCF7F), Warning (#FFB84D), Error (#FF6B6B)

## Typography

**Font**: Nunito (Google Font) for friendly warmth, paired with system font for inputs
- **Display**: Nunito Bold 32px (screen titles)
- **Heading**: Nunito SemiBold 24px (card titles)
- **Body**: Nunito Regular 16px (content, line-height 1.6)
- **Caption**: Nunito Regular 14px (metadata, labels)
- **Button**: Nunito SemiBold 16px

## Visual Design

- All touchable elements: 300ms scale animation (0.97) on press
- Buttons: Rounded corners 12px, gradient fills for primary actions
- Cards: Border radius 16px, subtle shadow (offset: 0,2 / opacity: 0.08 / radius: 8)
- FAB: Shadow offset 0,4 / opacity 0.15 / radius 8
- Use Feather icons throughout, 24px default size
- Generous whitespace: base spacing unit = 16px

## Assets to Generate

**REQUIRED**:
1. **icon.png** - App icon: Stylized crescent moon with dreamy gradient, simple/memorable
2. **splash-icon.png** - Same as icon, centered on gradient background
3. **empty-journal.png** - Illustration: Crescent moon with three soft stars, used on Journal empty state
4. **empty-search.png** - Illustration: Magnifying glass over faded moon, used on Search no results
5. **empty-calendar.png** - Illustration: Calendar page with moon phases, used on Calendar before first entry
6. **onboarding-welcome.png** - Hero illustration: Sleeping person with dream bubbles, used on auth welcome screen
7. **default-avatar.png** - User avatar: Circular gradient with moon silhouette, used in Settings

**RECOMMENDED**:
8. **reflect-bg.png** - Soft cosmic background for Reflect section
9. **lucidity-badge-*.png** - Badge icons for lucidity milestones (5 levels)

All illustrations: Soft gradients, indigo/violet/lavender palette, simple shapes, dreamy aesthetic. Avoid busy/complex imagery.