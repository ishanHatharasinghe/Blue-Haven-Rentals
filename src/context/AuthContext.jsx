import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { getUserProfile } from "../firebase/dbService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user profile data
  const fetchUserProfile = async (currentUser) => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }

    try {
      const profile = await getUserProfile(currentUser.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await fetchUserProfile(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Function to refresh user profile data (useful after profile updates)
  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  };

  // Helper function to check if user has a specific role
  const hasRole = (role) => {
    return userProfile?.role === role;
  };

  // Helper function to check if user is admin
  const isAdmin = () => {
    return userProfile?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, loading, hasRole, isAdmin, refreshUserProfile }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
