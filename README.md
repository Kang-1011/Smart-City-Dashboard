# Smart-City-Dashboard

A real-time smart city dashboard that visualises temperature, AQI, and traffic levels across different zones using Vue 3, Firebase Functions, and Firestore. It does the following
- Displays sensor readings: temperature, air quality index (AQI), traffic level.
- Updates these values every few seconds (60 seconds).
- Allows filtering by city zone (Downtown, Suburbs, Industrial).

## System Architecture
- Frontend: Vue 3
- Backend: Firebase Cloud Functions
- Database: Firestore (stores simulated sensor data)
- Scheduler: Firebase Scheduled Functions to generate and store new sensor data every minute
   
<img width="538" height="579" alt="image" src="https://github.com/user-attachments/assets/31d986a3-05ee-4f53-a0bc-93028d79a08d" />

1. The user interacts with the Vue frontend hosted on Firebase Hosting. 
2. The frontend sends requests to the Firebase Function HTTP endpoint to fetch the latest sensor data.
3. Scheduled Functions (also Firebase Functions) generate and store new sensor readings in Firestore every minute.
4. Firestore acts as the real-time data source.

## Setup Instructions (Run Locally)
Clone the project
```bash
  git clone https://github.com/Kang-1011/Smart-City-Dashboard.git
```

Go to the project directory
```bash
  cd Smart-City-Dashboard
  cd dashboard-frontend
```

Install dependencies
```bash
  npm install
```

Start the server
```bash
  npm run dev
```

## Link to live deployment
https://wk-smart-city-dashboard.web.app/
