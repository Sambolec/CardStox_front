<template>
  <div class="home-page">
    <div class="center-content">
      <h1 class="main-title">CardStox</h1>
      <div class="search-container">
        <input
          v-model="search"
          class="search-bar"
          placeholder="Search cards..."
        />
        <span class="search-icon">🔍</span>
      </div>
      <div class="card-grid">
        <router-link
          v-for="card in filteredCards"
          :key="card._id"
          :to="`/card/${card._id}`"
          class="card-item-link"
          style="text-decoration: none;"
        >
          <div class="card-item">
            <img :src="card.image" alt="card.name" class="card-img" />
            <h3 class="card-title">{{ card.name }}</h3>
            <div class="card-game">{{ card.game }}</div>
            <div class="card-price">€{{ card.price }}</div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomePage',
  data() {
    return {
      cards: [],
      search: ''
    }
  },
  computed: {
    filteredCards() {
      if (!this.search) return this.cards;
      return this.cards.filter(card =>
        card.name.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  mounted() {
    axios.get('http://localhost:5000/api/cards')
      .then(res => {
        this.cards = res.data;
      })
      .catch(err => {
        console.error('API error:', err);
      });
  }
}
</script>

<style>
body {
  background: #6dc0a6 !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
  width: 100%;
}
.main-title {
  font-size: 2.5em;
  color: #4b3c1a;
  margin-bottom: 1.5em;
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 2px;
}
.search-container {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 0.3em 1em;
  box-shadow: 0 2px 8px #0001;
  margin-bottom: 2em;
}
.search-bar {
  border: none;
  outline: none;
  font-size: 1.2em;
  padding: 0.5em;
  border-radius: 20px;
  width: 250px;
  background: transparent;
}
.search-icon {
  font-size: 1.4em;
  color: #6b4f27;
  margin-left: 0.5em;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  width: 100%;
}
.card-item-link {
  text-decoration: none;
}
.card-item {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 16px #0002;
  width: 280px;
  padding: 1.2em 1em 1.5em 1em;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
  cursor: pointer;
}
.card-item:hover {
  transform: scale(1.05);
}
.card-img {
  width: 95%;
  height: 180px;
  object-fit: contain;   /* ensures the whole image is visible, not cropped */
  border-radius: 12px;
  background: #eee;
  margin-bottom: 1em;
  box-shadow: 0 2px 8px #0001;
  display: block;
}
.card-title {
  font-size: 1.15em;
  color: #2b1c0a;
  font-weight: bold;
  margin-bottom: 0.3em;
  font-family: 'Montserrat', sans-serif;
}
.card-game {
  color: #6b4f27;
  font-size: 1em;
  margin-bottom: 0.2em;
}
.card-price {
  color: #8a4c1e;
  font-size: 1em;
}
</style>
