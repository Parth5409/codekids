# CodeKids

**CodeKids** is an interactive coding platform designed for kids and beginners. It features gamified learning, coding challenges, a customizable robot avatar, and a global leaderboard—all built with a modern full-stack approach.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Interactive Coding Challenges:** Drag-and-drop and code-based tasks.
- **Gamified Progress:** Earn points, badges, and level up.
- **Leaderboard:** Compete globally or by country.
- **Profile Customization:** Personalize your robot avatar.
- **Onboarding Tutorial:** Step-by-step guide for new users.
- **Secure Authentication:** JWT-based login and registration.
- **Responsive UI:** Mobile-friendly and visually engaging.

---

## Tech Stack

### Frontend

- **React** (Vite)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Material UI** for components/icons
- **Axios** for API requests

### Backend

- **Spring Boot** (Java 17)
- **Spring Data JPA** (PostgreSQL)
- **Spring Security** (JWT)
- **Cloudinary** for image uploads
- **Lombok** for boilerplate reduction

---

## Project Structure

```
CodeKids/
│
├── Backend/
│   ├── pom.xml
│   └── src/
│       └── main/
│           └── java/com/parth/Backend/
│               ├── controller/
│               ├── dto/
│               ├── model/
│               ├── repository/
│               ├── service/
│               └── ... (other backend files)
│
├── Frontend/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── context/
│       ├── pages/
│       ├── components/
│       └── ... (other frontend files)
│
└── README.md
```

---

## Getting Started

### Backend Setup

1. **Requirements:**
   - Java 17+
   - Maven
   - PostgreSQL

2. **Configuration:**
   - Set up your PostgreSQL database.
   - Configure your database and Cloudinary credentials in `application.properties` or as environment variables.

3. **Build & Run:**
   ```bash
   cd Backend
   mvnw spring-boot:run
   ```
   The backend runs at [http://localhost:8080](http://localhost:8080).

---

### Frontend Setup

1. **Requirements:**
   - Node.js (v16+ recommended)
   - npm or yarn

2. **Install Dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `Frontend` directory:
   ```
   VITE_API_URL=http://localhost:8080
   ```

4. **Run the App:**
   ```bash
   npm run dev
   ```
   The frontend runs at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

### Backend (`application.properties`)

```
spring.datasource.url=jdbc:postgresql://localhost:5432/codekids
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password

cloudinary.cloud_name=your_cloud_name
cloudinary.api_key=your_api_key
cloudinary.api_secret=your_api_secret

jwt.secret=your_jwt_secret
```

### Frontend (`Frontend/.env`)

```
VITE_API_URL=http://localhost:8080
```

---

## Usage

- **Sign Up:** Create an account and upload your avatar.
- **Login:** Access your dashboard, challenges, and leaderboard.
- **Dashboard:** Track your coding progress, badges, and activities.
- **Challenges:** Solve tasks to earn points and badges.
- **Leaderboard:** See your global or country rank.
- **Tutorial:** Follow the interactive onboarding.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## Acknowledgements

- [Spring Boot](https://spring.io/projects/spring-boot)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Material UI](https://mui.com/)

---