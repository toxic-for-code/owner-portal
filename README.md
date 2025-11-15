# WeEnYou Hall Owner Portal

A modern, responsive owner portal for event hall management built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure sign-up and sign-in with NextAuth.js
- **Multi-step Form**: Modern, responsive hall listing form with stepper
- **Owner-only Access**: Restricted to users with "owner" role and "active" status
- **Glassmorphism UI**: Beautiful, modern design with backdrop blur effects
- **Mobile Responsive**: Optimized for all device sizes
- **MongoDB Integration**: Full database integration with Mongoose
- **Image Upload**: Drag-and-drop photo upload functionality

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: NextAuth.js with credentials provider
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom glassmorphism effects
- **State Management**: React hooks for local state

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- npm or yarn

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd owner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/weenyou
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
owner/
├── lib/
│   └── auth.ts              # Shared NextAuth configuration
├── models/
│   ├── User.ts              # User schema and model
│   └── Hall.ts              # Hall schema and model
├── pages/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth].ts  # NextAuth API route
│   │   │   └── signup.ts         # User registration API
│   │   └── halls.ts              # Hall submission API
│   ├── _app.tsx                 # App wrapper with NextAuth
│   ├── index.tsx                # Home page
│   ├── signin.tsx               # Sign-in page
│   ├── signup.tsx               # Sign-up page
│   └── list-your-hall.tsx       # Multi-step hall listing form
├── public/
│   └── logo.png                 # WeEnYou logo
└── styles/
    └── globals.css              # Global styles
```

## Key Features

### Authentication Flow
- Users can sign up as hall owners
- Only users with "owner" role and "active" status can access owner features
- Secure password hashing with bcrypt
- JWT-based sessions with NextAuth

### Multi-step Hall Listing Form
1. **Venue Details**: Name and description
2. **Location**: Address, city, state, pincode
3. **Pricing**: Price per event and capacity
4. **Amenities**: Predefined and custom amenities
5. **Photos**: Drag-and-drop image upload
6. **Review & Submit**: Final review before submission

### Database Schema

#### User Model
- name, email, password (hashed)
- phone, image (optional)
- role: 'user' | 'admin' | 'owner' | 'provider'
- status: 'active' | 'suspended'
- wishlist: array of hall IDs

#### Hall Model
- name, description, images
- price, capacity, amenities
- location with geocoordinates
- ownerId (reference to User)
- status: 'pending' | 'active' | 'inactive'
- verified: boolean
- availability, ratings, reviews

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/halls` - Hall submission (owner-only)
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

## Styling

The application uses Tailwind CSS with custom glassmorphism effects:
- Backdrop blur containers
- Modern gradient buttons
- Responsive design
- Consistent branding with WeEnYou colors

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Protected API routes

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NEXTAUTH_SECRET` | Secret key for NextAuth | Yes |
| `NEXTAUTH_URL` | Base URL for NextAuth | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to WeEnYou. 