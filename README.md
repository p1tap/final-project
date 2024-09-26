# Final Project

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Final Project. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

This is a social media web app built with Next.js, MongoDB, and Cloudinary.

Features:
* User authentication (login, logout, register) with local storage
* Post creation / deletion / editing / sorting
* image upload on post / profile / comment 
* Commenting / deletion / editing
* Profile creation / editing / viewing
* Liking / unliking posts
* Image upload / deletion / editing
* Search for users and posts



<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

This project is built with the following major frameworks and libraries:

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![MUI][MUI]][MUI-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Cloudinary][Cloudinary]][Cloudinary-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/p1tap/final-project.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Set up environment variables
   ```sh
   cp .env.example .env
   ```
4. Enter your API keys and other environment variables in `.env`
   ```sh
    MONGODB_URI=YOUR_MONGODB_URI
    CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
    CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
    CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
   ```

### Data model

1. **User**:
   - `_id`: User ID (ObjectId)
   - `username`: Username (String, required, unique)
   - `password`: Hashed password (String, required)
   - `name`: User's name (String, required)
   - `bio`: User's biography (String, default: "")
   - `profilePicture`: URL to the profile picture (String, default: "")

2. **Post**:
   - `_id`: Post ID (ObjectId)
   - `user`: Reference to User (ObjectId, required)
   - `content`: Content of the post (String, default: "")
   - `image`: URL to the image of the post (String or null)
   - `createdAt`: Timestamp of post creation (Date, default: current date)
   - `updatedAt`: Timestamp of last update (Date, default: current date)

3. **Comment**:
   - `_id`: Comment ID (ObjectId)
   - `user`: Reference to User (ObjectId, required)
   - `post`: Reference to Post (ObjectId, required)
   - `content`: Content of the comment (String, default: "")
   - `image`: URL to the image of the comment (String, default: null)
   - `createdAt`: Timestamp of comment creation (Date, default: current date)
   - `updatedAt`: Timestamp of last update (Date, default: current date)

4. **Like**:
   - `_id`: Like ID (ObjectId)
   - `user`: Reference to User (ObjectId, required)
   - `post`: Reference to Post (ObjectId, required)

5. **CommentLike**:
   - `_id`: CommentLike ID (ObjectId)
   - `user`: Reference to User (ObjectId, required)
   - `comment`: Reference to Comment (ObjectId, required)

Note: The User model also includes a method `comparePassword` for password verification.

   

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/your_username/final-project.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/final-project/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/final-project.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/final-project/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/final-project.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/final-project/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/final-project.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/final-project/issues
[license-shield]: https://img.shields.io/github/license/your_username/final-project.svg?style=for-the-badge
[license-url]: https://github.com/your_username/final-project/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[MUI]: https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Cloudinary]: https://img.shields.io/badge/Cloudinary-007ACC?style=for-the-badge&logo=cloudinary&logoColor=white
[Cloudinary-url]: https://cloudinary.com/
