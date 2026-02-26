# React Example Components - Goals Module

A comprehensive React/TypeScript application demonstrating modern frontend development patterns with a focus on Goals management functionality.

## 🚀 Technologies Used

### Core Framework & Language
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **JSX** - React's syntax extension for UI components

### UI Framework & Styling
- **Material-UI (MUI) v5** - Comprehensive React component library
  - `@mui/material` - Core Material Design components
  - `@mui/x-data-grid-pro` - Advanced data grid with tree data support
- **Emotion** - CSS-in-JS styling solution
  - `@emotion/react` - Core Emotion runtime
  - `css` prop for styled components

### Form Management & Validation
- **React Hook Form** - Performant, flexible forms with easy validation
- **Yup** - JavaScript schema builder for value parsing and validation
- `@hookform/resolvers/yup` - Integration between React Hook Form and Yup

### Routing & Navigation
- **React Router v6** - Declarative routing for React applications
- `react-router-dom` - DOM bindings for React Router

### Icons & Assets
- **Font Awesome Pro** - Premium icon library
  - `@fortawesome/pro-light-svg-icons` - Light weight icons
  - `@fortawesome/pro-solid-svg-icons` - Solid icons
  - `@fortawesome/react-fontawesome` - React component for Font Awesome

### State Management & Data Fetching
- **React Query** - Server state management and data fetching
- **Zustand** - Small, fast, and scalable state management
- **React Context** - Built-in state management for global state

### Rich Text Editing
- **Froala WYSIWYG Editor** - Advanced rich text editing capabilities

### Development Tools & Utilities
- **History** - Session history management
- **Lodash** - Modern JavaScript utility library
- **Custom Hooks** - Reusable stateful logic

## 📁 Project Structure

### `/goals/` - Main Goals Module
The primary directory containing all Goals-related functionality.

#### `/components/` - React Components
**UI Components organized by feature and reusability:**

- **`/DeleteAfterGoalsV4/`** - Legacy components being phased out
  - Table components, filters, and deprecated UI elements
  - Contains `GoalsTable.tsx`, `TabHeader.tsx`, various filter components
  
- **`/GoalDetails/`** - Goal detail view components
  - `GoalActionItems.tsx` - Action items management
  - `EditGoal/` - Goal editing functionality
  - `LinkedGoals/` - Parent/child goal relationships
  - `GoalDetailsStatus.tsx` - Status display and management

- **`/Shared/`** - Reusable components across the application
  - `CreateEditGoalForm/` - Comprehensive goal creation/editing form
  - `GoalStatus/` - Status badges and indicators
  - `Tables/` - Data table components
  - `TargetValue/` - Goal target value display components

- **`/PerformanceSnapshot/`** - Performance tracking components
- **`/GoalStatusHistoryModal/`** - Status change history modal

#### `/hooks/` - Custom React Hooks
**Business logic and state management:**

- **`/aiDrafting/`** - AI-powered content generation hooks
- **`/linkGoals/`** - Goal relationship management hooks  
- **`/statusUpdates/`** - Status update functionality hooks
- **`/utils/`** - Utility hooks for common operations
  - Form validation, permissions, routing, feature flags

**Key Hooks:**
- `useCreateGoal.ts` - Goal creation logic
- `useEditGoal.ts` - Goal editing functionality
- `useGetGoals.ts` - Goals data fetching
- `useUpdateGoal.ts` - Goal update operations

#### `/const/` - Constants and Configuration
- `types.ts` - TypeScript type definitions
- `defaults.tsx` - Default values and configurations
- `styles.ts` - Shared styling constants
- `queryKeys.ts` - React Query key definitions
- `functions.ts` - Utility functions

#### `/schemata/` - Form Validation Schemas
- `CreateEditGoalStatusUpdateSchema.ts` - Status update form validation
- Yup schemas for form validation with React Hook Form

#### `/stores/` - State Management
- Zustand stores for global state management
- Custom hooks for accessing store state

#### `/routes/` - Route Configuration
- `GoalsRouter.tsx` - Main routing configuration
- `ViewGoal.tsx` - Individual goal view route

#### `/pages/` - Page Components
- `GoalsLandingPage.tsx` - Main goals landing page

#### `/providers/` - Context Providers
- React context providers for global state

#### `/utils/` - Utility Functions
- Helper functions and utilities

#### `/assets/` - Static Assets
- Images, icons, and other static resources

### `/DevelopmentPlan/` - Development Planning Module
Similar structure to the goals module but focused on development planning features.

## 🎯 Key Features

### Goals Management
- **Create, Edit, Delete Goals** - Full CRUD operations
- **Goal Hierarchies** - Parent/child goal relationships
- **Status Tracking** - Comprehensive status management with history
- **Performance Metrics** - Target values and progress tracking
- **Collaboration** - Goal participants and ownership

### Advanced UI Components
- **Data Grids** - Sortable, filterable tables with tree data support
- **Modal Systems** - Reusable modal components
- **Form Systems** - Complex forms with validation
- **Status Indicators** - Visual status representation
- **Rich Text Editing** - Froala integration for content creation

### Development Patterns
- **Component Composition** - Reusable, composable components
- **Custom Hooks** - Separation of business logic
- **TypeScript Integration** - Full type safety
- **CSS-in-JS** - Styled components with Emotion
- **Form Validation** - Yup + React Hook Form integration

## 🛠 Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- TypeScript knowledge

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install
# or
yarn install
```

### Development
```bash
# Start development server
npm start
# or
yarn start

# Run tests
npm test
# or
yarn test

# Build for production
npm run build
# or
yarn build
```

## 📋 Code Standards

### TypeScript
- Strict type checking enabled
- Interface definitions for all data structures
- Generic types for reusable components

### React Patterns
- Functional components with hooks
- Custom hooks for business logic
- Prop interfaces for all components
- Emotion CSS-in-JS for styling

### File Organization
- Feature-based folder structure
- Index files for clean imports
- Consistent naming conventions
- Separation of concerns

## 🎨 Styling Approach

### Emotion CSS-in-JS
- Component-scoped styles
- Theme integration with Material-UI
- Responsive design patterns
- CSS custom properties for theming

### Material-UI Integration
- Custom theme configuration
- Component customization
- Responsive breakpoints
- Dark/light theme support

## 📊 State Management Strategy

### React Query
- Server state management
- Caching and synchronization
- Optimistic updates
- Background refetching

### Zustand
- Client state management
- Lightweight and fast
- TypeScript integration
- DevTools support

### React Context
- Global configuration
- Theme and settings
- User preferences

## 🧪 Testing Approach

### Unit Testing
- Jest for test framework
- React Testing Library for component testing
- Mock implementations for external dependencies

### Integration Testing
- Component integration tests
- Hook testing utilities
- User interaction simulation

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading with React.lazy
- Route-based code splitting
- Component-level splitting

### Memoization
- React.memo for component memoization
- useMemo for expensive computations
- useCallback for function references

### Bundle Optimization
- Tree shaking
- Dynamic imports
- Asset optimization

## 🔍 Debugging & Development Tools

### TypeScript
- Strict type checking
- IntelliSense support
- Compile-time error detection

### React DevTools
- Component inspection
- Props and state debugging
- Performance profiling

### Browser DevTools
- Network request monitoring
- Console error tracking
- Performance analysis

## 📚 Documentation

### Code Documentation
- JSDoc comments for complex functions
- TypeScript interfaces as documentation
- Component prop documentation
- README files for major modules

### API Documentation
- Hook parameter documentation
- Return type specifications
- Usage examples
- Best practices

## 🤝 Contributing Guidelines

### Code Style
- ESLint configuration
- Prettier formatting
- Conventional commits
- TypeScript strict mode

### Pull Request Process
- Feature branch development
- Code review requirements
- Automated testing
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

### Planned Features
- Enhanced AI integration
- Advanced analytics dashboard
- Mobile-responsive improvements
- Accessibility enhancements

### Technical Improvements
- Microservices architecture
- Advanced caching strategies
- Real-time updates
- Performance optimizations

---

**Note:** This project serves as a comprehensive example of modern React development practices, demonstrating enterprise-level application architecture with TypeScript, Material-UI, and custom component libraries.
