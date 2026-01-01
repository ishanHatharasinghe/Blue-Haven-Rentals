// src/App.jsx
import React, { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { SignupProvider } from "./context/SignupContext";
import AppRoutes from "./routes/AppRoutes";
import { initializeTestUser } from "./utils/testUserSetup";

function App() {
  useEffect(() => {
    // Initialize test user on first app load
    initializeTestUser();
  }, []);

  return (
    <AuthProvider>
      <SignupProvider>
        <AppRoutes />
      </SignupProvider>
    </AuthProvider>
  );
}

export default App;
