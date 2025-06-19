<template>
  <nav class="navbar">
    <div class="logo">CardStox</div>
    <div class="nav-buttons">
      <router-link to="/popular" class="nav-btn">Popular</router-link>
      <router-link to="/categories" class="nav-btn">Categories</router-link>
      <router-link to="/" class="nav-btn">Home</router-link>
      <template v-if="isLoggedIn">
        <router-link to="/profile" class="avatar-link">
          <span class="avatar-emoji" title="Profile" aria-label="Profile">👤</span>
        </router-link>
        <button @click="logout" class="nav-btn logout-btn">Logout</button>
      </template>
      <template v-else>
        <router-link to="/login" class="nav-btn">Login</router-link>
        <router-link to="/register" class="nav-btn">Register</router-link>
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      isLoggedIn: !!localStorage.getItem("token")
    }
  },
  created() {
    window.addEventListener('storage', this.syncAuth);
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncAuth);
  },
  methods: {
    syncAuth() {
      this.isLoggedIn = !!localStorage.getItem("token");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      this.isLoggedIn = false;
      this.$router.push("/");
      window.location.reload(); // Ensures all components update
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #6b4f27;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 2em;
  border-radius: 0 0 20px 20px;
}
.logo {
  font-weight: bold;
  font-size: 1.5em;
  letter-spacing: 2px;
}
.nav-buttons {
  display: flex;
  align-items: center;
  gap: 1em;
}
.nav-btn {
  background: #fff;
  color: #6b4f27;
  border: none;
  border-radius: 20px;
  padding: 0.5em 1.2em;
  font-weight: bold;
  margin-right: 0.5em;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
  font-family: inherit;
}
.logout-btn {
  background: #c0392b;
  color: #fff;
  margin-left: 0.5em;
}
.nav-btn.router-link-exact-active {
  background: #b8d8ba;
  color: #4b3c1a;
}
.nav-btn:hover, .logout-btn:hover {
  background: #b8d8ba;
  color: #333;
}
.avatar-link {
  display: flex;
  align-items: center;
  margin-left: 0.5em;
}
.avatar-emoji {
  font-size: 2.2em;
  margin-left: 1em;
  cursor: pointer;
  user-select: none;
  line-height: 1;
  transition: box-shadow 0.2s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #fff;
  border: 2px solid #fff;
}
.avatar-emoji:hover {
  box-shadow: 0 0 0 3px #b8d8ba;
  background: #f9f9f9;
}
</style>
