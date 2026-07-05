# ShareIT

ShareIT is a full-stack social media web app built with Next.js, MongoDB, and Cloudinary. It lets users create accounts, publish image-based posts, comment on posts, like posts and comments, search for users/content, and manage their own profile.

The project focuses on a complete social app workflow: authentication, post creation, image upload, profile pages, comments, likes, editing/deletion flows, search, and a responsive UI built with Material UI.

## Live Demo

[ShareIT](https://solo-social-frontend.vercel.app/)

## Screenshots

### Home Page
![Home Page](/public/home.png)

### Profile Page
![Profile Page](/public/profile.png)

### Edit Profile
![Edit Profile](/public/editprofile.png)

### Login Page
![Login Page](/public/login.png)

### Register Page
![Register Page](/public/register.png)

### Search Functionality
![Search Functionality](/public/search.png)

### Comment Section
![Comment Section](/public/comment.png)

### Like and Comment Interaction
![Like and Comment Interaction](/public/like-comment.png)

### Image Comment
![Image Comment](/public/image-comment.png)

### Comment Edit and Delete
![Comment Edit and Delete](/public/edit-del-comment.png)

### Edit and Delete Post
![Edit and Delete Post](/public/edit-del-post.png)

## Features

- User registration and login
- Password hashing with bcrypt
- Client-side auth state with local storage
- Create, edit, delete, and sort posts
- Upload images for posts, comments, and profile pictures
- Comment on posts with optional image attachments
- Edit and delete comments
- Like and unlike posts
- Like and unlike comments
- View user profiles and profile posts
- Edit profile name, bio, and profile picture
- Search users and posts
- Toast notifications for user feedback

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 14 App Router, React 18, TypeScript |
| UI | Material UI, Tailwind CSS |
| Database | MongoDB, Mongoose |
| Auth | bcryptjs, local storage auth state |
| Media | Cloudinary, Formidable, Multer |
| Feedback | React Toastify |

## Project Structure

```txt
app/
  api/                    API routes for auth, users, posts, comments, likes, search, and profiles
  components/             Forms, header, post cards, comments, sorting, and profile editing
  contexts/               Client-side auth context
  login/                  Login page
  register/               Registration page
  profile/[userid]/       User profile page
  search/                 Search results page
lib/
  dbConnect.ts            MongoDB connection helper
  uploadHandler.ts        Image upload handling
models/
  User.ts                 User schema and password comparison
  Post.ts                 Post schema
  Comment.ts              Comment schema
  Like.ts                 Post-like schema
  CommentLike.ts          Comment-like schema
public/                   App logo and README screenshots
```

## Data Model

### User

- `_id`: MongoDB ObjectId
- `username`: unique username
- `password`: hashed password
- `name`: display name
- `bio`: profile biography
- `profilePicture`: Cloudinary image URL

### Post

- `_id`: MongoDB ObjectId
- `user`: reference to `User`
- `content`: post text
- `image`: optional Cloudinary image URL
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Comment

- `_id`: MongoDB ObjectId
- `user`: reference to `User`
- `post`: reference to `Post`
- `content`: comment text
- `image`: optional Cloudinary image URL
- `createdAt`: creation timestamp
- `updatedAt`: last update timestamp

### Like

- `_id`: MongoDB ObjectId
- `user`: reference to `User`
- `post`: reference to `Post`

### CommentLike

- `_id`: MongoDB ObjectId
- `user`: reference to `User`
- `comment`: reference to `Comment`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB database
- Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/p1tap/solo-social.git
cd solo-social
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and add:

```env
MONGODB_URI=YOUR_MONGODB_URI
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
```

### 4. Start the development server

```bash
npm run dev
```

Start your server and open the app in your browser.

## API Overview

| Resource | Endpoints |
| --- | --- |
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Users | `GET /api/users`, `GET /api/users/[userId]`, `PUT /api/users/[userId]/edit` |
| Posts | `GET/POST /api/posts`, `GET/DELETE /api/posts/[postId]`, `PUT /api/posts/[postId]/edit` |
| Comments | `POST /api/comments`, `DELETE /api/comments/[commentId]`, `PUT /api/comments/[commentId]/edit` |
| Likes | `POST /api/likes`, `POST /api/comments/[commentId]/likes` |
| Search | `GET /api/search` |
| Profile | `GET /api/profile/[userId]` |

## Implementation Notes

- Authentication uses client-side local storage state after login.
- Passwords are hashed with bcrypt before being stored.
- Cloudinary is used for post, comment, and profile image uploads.
- MongoDB/Mongoose models define users, posts, comments, post likes, and comment likes.
- The app is deployed under the original `solo-social` deployment URL, while the project display name is now ShareIT.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build production app
npm run start    # Run production build
npm run lint     # Run linting
```
