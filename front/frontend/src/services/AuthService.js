class AuthService {
  constructor() {
    this.isAuthenticated = this.checkAuthStatus();
  }

  checkAuthStatus() {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  login(username, password) {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (username === 'admin' && password === 'admin123') {
          const user = {
            username: username,
            role: 'Security Administrator',
            loginTime: new Date().toISOString(),
            sessionToken: this.generateSessionToken()
          };
          
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          this.isAuthenticated = true;
          resolve(user);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1500);
    });
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    this.isAuthenticated = false;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  generateSessionToken() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  isSessionValid() {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const loginTime = new Date(user.loginTime);
    const currentTime = new Date();
    const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
    
    return (currentTime - loginTime) < sessionDuration;
  }
}

export default new AuthService();
