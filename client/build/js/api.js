// API client for Mindful Me backend
const API_URL = 'http://localhost:5000/api';

// Helper function for making API requests
async function fetchAPI(endpoint, method = 'GET', data = null, token = null) {
  console.log(`Calling API: ${API_URL}${endpoint}`);
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Create MindfulMe API client
window.mindfulmeAPI = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      return fetchAPI('/users/login', 'POST', { email, password });
    },
    
    register: async (name, email, password) => {
      return fetchAPI('/users/register', 'POST', { name, email, password });
    },
    
    getCurrentUser: async (token) => {
      return fetchAPI('/users/me', 'GET', null, token);
    },
    
    updateProfile: async (userData, token) => {
      return fetchAPI('/users/profile', 'PUT', userData, token);
    },
    
    changePassword: async (currentPassword, newPassword, token) => {
      return fetchAPI('/users/change-password', 'POST', { currentPassword, newPassword }, token);
    }
  },
  
  user: {
    getSettings: async (token) => {
      return fetchAPI('/users/settings', 'GET', null, token);
    },
    
    updateSettings: async (settings, token) => {
      return fetchAPI('/users/settings', 'PUT', settings, token);
    }
  },
  
  journal: {
    getEntries: async (token) => {
      return fetchAPI('/journal', 'GET', null, token);
    },
    
    getEntry: async (entryId, token) => {
      return fetchAPI(`/journal/${entryId}`, 'GET', null, token);
    },
    
    createEntry: async (entryData, token) => {
      return fetchAPI('/journal', 'POST', entryData, token);
    },
    
    updateEntry: async (entryId, entryData, token) => {
      return fetchAPI(`/journal/${entryId}`, 'PUT', entryData, token);
    },
    
    deleteEntry: async (entryId, token) => {
      return fetchAPI(`/journal/${entryId}`, 'DELETE', null, token);
    }
  },
  
  chatbot: {
    startConversation: async (token) => {
      return fetchAPI('/chatbot/conversation', 'POST', {}, token);
    },
    
    sendMessage: async (conversationId, message, token) => {
      return fetchAPI('/chatbot/message', 'POST', { conversationId, message }, token);
    },
    
    getConversation: async (conversationId, token) => {
      return fetchAPI(`/chatbot/conversation/${conversationId}`, 'GET', null, token);
    },
    
    clearConversation: async (conversationId, token) => {
      return fetchAPI(`/chatbot/conversation/${conversationId}/clear`, 'POST', null, token);
    }
  },
  
  // FIXED MOOD APIs – NOW USING fetchAPI INSTEAD OF RELATIVE FETCH
  mood: {
    getMoods: async (token) => {
      return fetchAPI('/mood', 'GET', null, token);
    },
    
    createMood: async (moodData, token) => {
      return fetchAPI('/mood', 'POST', moodData, token);
    },
    
    deleteMood: async (id, token) => {
      return fetchAPI(`/mood/${id}`, 'DELETE', null, token);
    },
    
    getStats: async (period = 'week', token) => {
      return fetchAPI(`/mood/stats?period=${period}`, 'GET', null, token);
    }
  }
};