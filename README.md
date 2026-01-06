# IP Location Lookup
A React + TypeScript application that allows users to enter one or more IP addresses
and see their country, flag, and time.

## Tech Stack
- React + TypeScript
- Vite
- Material UI (MUI)
- Jest + React Testing Library

## UI & Styling

### Why Material UI (MUI)

Material UI was used to:
- Ensure accessible and consistent UI components
- Avoid writing low-level CSS for common UI patterns (buttons, dialogs, inputs)

MUI’s `sx` prop was used for styling instead of separate CSS files.

### Why no separate CSS files

This project intentionally does not use separate `.css` files.
- Styles are tightly coupled to components
- Using MUI `sx` keeps styles close to the logic
- Easier refactoring and maintenance
- Avoids global CSS side effects

For a larger application or shared design system, extracting styles or using theme overrides would be a good next step.

### Empty Rows Behavior (UX Decision)
The user can add multiple rows even if some of them are empty.
This approach:
- Keeps the UI flexible and responsive
- Avoids unnecessary blocking of user actions
- Matches behavior seen in tools like Postman, AWS Console, and other developer-focused interfaces.

## API Usage
The application uses a public IP geolocation API to fetch:
- Country name
- Country code (for flag)
- Timezone

The API call is handled inside a custom hook (`useIpLookup`) to:
- Keep components clean
- Centralize API logic
- Make testing easier

Error cases such as:
- Invalid IPv4
- Reserved IP addresses
- Network errors  
are handled explicitly and reflected in the UI.

## Component Structure
The main UI is split into small, focused components:

- `IpLookupDialog` – main dialog and layout
- `IpLookupList` – renders the list of rows
- `IpLookupRow` – single IP input row with status handling

## Testing
Tests focus on user behavior

Examples:
- Rendering correct UI for different states
- Clicking buttons (Add / Close)
- Disabled states during loading
- Error and success rendering

Each component has its test file located next to the component.

## Running the project
npm install
npm run dev
