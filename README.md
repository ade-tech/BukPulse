# BUkPulse 🎓📱

> **The Digital Heartbeat of Bayero University Kano.**

![Project Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Tech Stack](https://img.shields.io/badge/Stack-React%20|%20TypeScript%20|%20Supabase-blue)

## 📖 About The Project

**BUkPulse** is a centralized campus companion application designed specifically for the students and management of Bayero University Kano (BUK).

In a campus environment where information is often fragmented across WhatsApp groups and word-of-mouth, BUkPulse serves as the **"Single Source of Truth."** It bridges the communication gap between the university management, student bodies (SUG/Faculties), and the general student population.

This project was built to solve three main problems:

1.  **Misinformation:** Eliminating "fake news" by allowing only verified admins to post updates.
2.  **Event Visibility:** Giving student organizations a dedicated space to publicize their programs.
3.  **Security:** implementing modern, passwordless authentication to protect student data.

## ✨ Key Features

- **📰 Verified News Feed:** Real-time updates from School Management and the Student Union.
- **📅 Event Management:** Discover, RSVP, and get reminders for campus events.
- **🔐 Passwordless Auth:** Secure login using Email OTP (No more forgotten passwords!).
- **🛡️ Role-Based Access:** Distinct dashboards for Students, Admins, and Content Creators.
- **📱 Mobile Responsive:** Optimized as a Progressive Web App (PWA) for use on any device.

## 🛠️ Tech Stack

- **Frontend:** React.js + TypeScript
- **Build Tool:** Vite
- **Styling:** Chakra UI
- **Backend / Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Link / OTP)
- **Icons:** Lucide React

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone [https://github.com/ade-tech/bukpulse.git](https://github.com/ade-tech/bukpulse.git)
    cd bukpulse
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables**
    Create a `.env` file in the root directory and add your Supabase credentials:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

5.  **Open in Browser**
    Visit `http://localhost:5173` to view the app.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Adelopo Abdullah**

- GitHub: [@ade-tech](https://github.com/ade-tech)
- LinkedIn: [Adelopo Abdullah](https://linkedin.com/in/abdone)

---

_Built with ❤️ for Bayero University Kano._
