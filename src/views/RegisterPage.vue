<template>
  <div class="register-page">
    <div class="register-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <label>
          Username
          <input v-model="username" type="text" placeholder="Username" required />
        </label>
        <label>
          Email
          <input v-model="email" type="email" placeholder="Email" required />
        </label>
        <label>
          Password
          <input v-model="password" type="password" placeholder="Password" required />
        </label>
        <button type="submit">Register</button>
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return { username: '', email: '', password: '', error: '' }
  },
  methods: {
    async register() {
      try {
        await axios.post('http://localhost:5000/api/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        // Auto-login after registration
        const loginRes = await axios.post('http://localhost:5000/api/login', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('token', loginRes.data.token);
        localStorage.setItem('username', loginRes.data.username);
        window.location.href = '/'; // Full reload for instant navbar update
      } catch (err) {
        this.error = err.response?.data?.error || 'Registration failed';
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6dc0a6;
}

.register-card {
  background: #fff;
  padding: 2.5em 2em 2em 2em;
  border-radius: 24px;
  box-shadow: 0 4px 24px #0002;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  font-family: 'Montserrat', sans-serif;
  color: #6b4f27;
  margin-bottom: 1.5em;
  font-size: 2em;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.2em;
  align-items: center;
}

label {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 500;
  color: #6b4f27;
  font-size: 1em;
}

input {
  margin-top: 0.4em;
  padding: 0.7em 1em;
  border: 1px solid #b8d8ba;
  border-radius: 12px;
  font-size: 1em;
  width: 100%;
  background: #f9f9f9;
  transition: border 0.2s;
  text-align: center;
}
input:focus {
  border: 1.5px solid #6dc0a6;
  outline: none;
}

button[type="submit"] {
  margin-top: 1em;
  background: #6b4f27;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.9em 0;
  font-size: 1.1em;
  font-family: 'Montserrat', sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
  box-shadow: 0 2px 8px #0001;
}
button[type="submit"]:hover {
  background: #4b3c1a;
}

.error-message {
  margin-top: 1em;
  color: #c0392b;
  font-size: 1em;
  text-align: center;
}
</style>
