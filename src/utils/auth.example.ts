/* eslint-disable @typescript-eslint/no-unused-vars */
// Example usage of authentication utility functions
import { getAuthToken, getCurrentUser, hasRole, isAdmin, isAuthenticated, isUser } from './auth';

// Example 1: Check if user is authenticated (can be used anywhere)
if (isAuthenticated()) {
  console.log('User is logged in');
} else {
  console.log('User is not logged in');
}

// Example 2: Get current user data
const user = getCurrentUser();
if (user) {
  console.log('Current user:', user.first_name, user.last_name);
  console.log('User email:', user.email);
}

// Example 3: Get authentication token
const token = getAuthToken();
if (token) {
  console.log('Auth token available');
}

// Example 4: Check user roles
if (hasRole('admin')) {
  console.log('User is an admin');
}

if (isAdmin()) {
  console.log('User is an admin');
}

if (isUser()) {
  console.log('User is a regular user');
}

// Example 5: Use in React components (reactive)
// In a React component:
/*
import { useAuth } from '@/utils/auth';

const MyComponent = () => {
  const { isAuthenticated, user, isAdmin, isUser } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.first_name}!</h1>
      {isAdmin && <p>You have admin privileges</p>}
      {isUser && <p>You are a regular user</p>}
    </div>
  );
};
*/

// Example 6: Clear authentication (logout)
// clearAuth(); // This will remove all auth data from localStorage

// Example 7: Conditional rendering based on authentication
const renderContent = () => {
  if (isAuthenticated()) {
    const user = getCurrentUser();
    return `Welcome back, ${user?.first_name}!`;
  }
  return 'Please log in to continue';
};

// Example 8: API calls with authentication check
const makeAuthenticatedRequest = async () => {
  if (!isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  const token = getAuthToken();
  // Use token in API call
  // const response = await fetch('/api/protected', {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
};

// Example 9: Route protection
const checkRouteAccess = (requiredRole?: string) => {
  if (!isAuthenticated()) {
    return false;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return false;
  }

  return true;
};

// Example 10: Middleware-like function
const withAuth = (callback: () => void) => {
  if (isAuthenticated()) {
    callback();
  } else {
    console.log('Authentication required');
    // Redirect to login or show login modal
  }
};
