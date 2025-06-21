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
    <hr class="profile-divider" />
    <button class="add-card-btn" @click="showAddCard = true">
      Put Card for Sale
    </button>
    <div v-if="showAddCard" class="add-card-modal">
      <form @submit.prevent="addCard">
        <h3>Add Card for Sale</h3>
        <input v-model="newCard.name" placeholder="Card Name" required />
        <select v-model="newCard.game" required>
          <option disabled value="">Select Game</option>
          <option>Pokemon</option>
          <option>Magic: The Gathering</option>
          <option>Yu-Gi-Oh!</option>
        </select>
        <input v-model="newCard.set" placeholder="Set" required />
        <input v-model.number="newCard.price" placeholder="Price (€)" required type="number" min="0" />
        <input v-model="newCard.image" placeholder="Image URL" required />
        <div class="add-card-actions">
          <button type="submit" class="submit-btn">Add Card</button>
          <button type="button" @click="showAddCard = false" class="cancel-btn">Cancel</button>
        </div>
      </form>
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
      error: null,
      showAddCard: false,
      newCard: {
        name: '',
        game: '',
        set: '',
        price: '',
        image: ''
      }
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
    },
    generatePriceHistory(basePrice, numPoints = 5, rangePercent = 0.5) {
      const priceHistory = [];
      const today = new Date();
      for (let i = 0; i < numPoints; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (numPoints - 1 - i));
        const minPrice = basePrice * (1 - rangePercent);
        const maxPrice = basePrice * (1 + rangePercent);
        const price = Math.round((Math.random() * (maxPrice - minPrice) + minPrice) * 100) / 100;
        priceHistory.push({
          date: date.toISOString().split('T')[0],
          price: price
        });
      }
      return priceHistory;
    },
    async addCard() {
      try {
        const priceHistory = this.generatePriceHistory(this.newCard.price);
        const cardData = {
          ...this.newCard,
          priceHistory: priceHistory
        };
        await axios.post('http://localhost:5000/api/cards', cardData);
        this.showAddCard = false;
        this.newCard = { name: '', game: '', set: '', price: '', image: '' };
        alert('Card added for sale!');
      } catch (err) {
        alert('Failed to add card.');
      }
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
.profile-divider {
  border: none;
  border-top: 2px solid #eee;
  margin: 1.5em 0 2em 0;
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
.add-card-btn {
  background: #6dc0a6;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.7em 1.5em;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  margin: 1.5em auto 2em auto;
  display: block;
  transition: background 0.2s;
}
.add-card-btn:hover {
  background: #4b3c1a;
}
.add-card-modal {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 4px 12px #0002;
  padding: 2em;
  margin: 2em auto;
  max-width: 400px;
}
.add-card-modal input,
.add-card-modal select {
  display: block;
  width: 100%;
  margin-bottom: 1em;
  padding: 0.5em;
  border-radius: 8px;
  border: 1px solid #b8d8ba;
  font-size: 1em;
}
.add-card-actions {
  display: flex;
  gap: 1em;
  margin-top: 1em;
}
.submit-btn {
  background: #6dc0a6;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 0.5em 1.2em;
  font-weight: bold;
  cursor: pointer;
}
.submit-btn:hover {
  background: #4b3c1a;
}
.cancel-btn {
  background: #eee;
  color: #6b4f27;
  border: none;
  border-radius: 10px;
  padding: 0.5em 1.2em;
  font-weight: bold;
  cursor: pointer;
}
.cancel-btn:hover {
  background: #f9d66a;
}
</style>
