<template>
  <div class="profile-page" v-if="user">
    <div class="profile-header">
      <img src="/profile-icon.svg" alt="Profile" class="profile-img" />
      <div>
        <h2>{{ user.username }}</h2>
        <div>{{ user.email }}</div>
        <div class="profile-stats">
          <span><b>Total cards:</b> {{ user.totalCards }}</span>
          <span><b>Total value:</b> €{{ user.totalValue }}</span>
          <span><b>Member since:</b> {{ user.memberSince }}</span>
        </div>
      </div>
    </div>
    <div class="profile-section">
      <h3>Wishlisted Cards</h3>
      <div v-if="user.wishlist.length" class="card-grid">
        <div v-for="card in user.wishlist" :key="card._id" class="card-item">
          <img :src="card.image" :alt="card.name" class="card-img" />
          <div class="card-info">
            <h4>{{ card.name }}</h4>
            <div>{{ card.game }}</div>
            <div>€{{ card.price }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-cards">No wishlisted cards</div>
    </div>
    <div class="profile-section">
      <h3>Bought Cards <span class="hint">(click to view/sell)</span></h3>
      <div v-if="user.bought.length" class="card-grid">
        <div
          v-for="card in user.bought"
          :key="card._id"
          class="card-item clickable"
          @click="goToCard(card._id)"
          title="Click to view and sell this card"
        >
          <img :src="card.image" :alt="card.name" class="card-img" />
          <div class="card-info">
            <h4>{{ card.name }}</h4>
            <div>{{ card.game }}</div>
            <div>€{{ card.price }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-cards">No bought cards</div>
    </div>
    <div class="profile-section">
      <h3>Sold Cards</h3>
      <div v-if="user.sold.length" class="card-grid">
        <div v-for="card in user.sold" :key="card._id" class="card-item sold">
          <img :src="card.image" :alt="card.name" class="card-img" />
          <div class="card-info">
            <h4>{{ card.name }}</h4>
            <div>{{ card.game }}</div>
            <div>€{{ card.price }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-cards">No sold cards</div>
    </div>
  </div>
  <div v-else class="profile-loading">Loading profile...</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ProfilePage',
  data() {
    return { 
      user: null,
      error: null
    }
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = res.data;
      } catch (err) {
        this.error = 'Failed to load profile';
      }
    },
    goToCard(cardId) {
      this.$router.push(`/card/${cardId}`);
    }
  }
}
</script>

<style scoped>
.profile-page { 
  max-width: 900px; 
  margin: 2em auto;
  padding: 1em;
}
.profile-header { 
  display: flex; 
  align-items: center; 
  gap: 2em; 
  margin-bottom: 2em;
  padding-bottom: 1em;
  border-bottom: 2px solid #f0f0f0;
}
.profile-img { 
  width: 80px; 
  height: 80px; 
  border-radius: 50%;
  background: #f0f0f0;
  padding: 10px;
}
.profile-stats {
  margin-top: 1em;
  font-size: 1.1em;
  color: #4b3c1a;
  display: flex;
  gap: 2em;
  flex-wrap: wrap;
}
.profile-section { 
  margin-bottom: 3em; 
}
.profile-loading, .no-cards { 
  text-align: center; 
  margin-top: 2em; 
  color: #6b4f27;
  font-size: 1.2em;
  padding: 1em;
  background: #f9f9f9;
  border-radius: 12px;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5em;
  justify-content: center;
}
.card-item {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 12px #0002;
  width: 200px;
  padding: 1em;
  text-align: center;
  transition: transform 0.2s, background 0.2s;
  cursor: default;
}
.card-item.clickable {
  cursor: pointer;
  border: 2px solid #6dc0a6;
}
.card-item.clickable:hover {
  background: #e9f7f1;
  transform: scale(1.05);
}
.card-item.sold {
  opacity: 0.7;
  background: #f6e2e2;
}
.card-img {
  width: 100%;
  height: 150px;
  object-fit: contain;
  border-radius: 8px;
  background: #eee;
  margin-bottom: 0.5em;
  box-shadow: 0 2px 8px #0001;
}
.card-info {
  margin-top: 0.5em;
}
.hint {
  font-size: 0.9em;
  color: #888;
  margin-left: 0.5em;
}
</style>
