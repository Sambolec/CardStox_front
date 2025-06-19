<template>
  <div class="popular-page">
    <h1>Popular Cards (≥ €20 increase in last 10 days)</h1>
    <div v-if="cards.length === 0">No popular cards found.</div>
    <div class="card-grid">
      <router-link
        v-for="card in cards"
        :key="card._id"
        :to="`/card/${card._id}`"
        class="card-item-link"
        style="text-decoration: none;"
      >
        <div class="card-item">
          <img :src="card.image" alt="card.name" class="card-img" />
          <h3>{{ card.name }}</h3>
          <div>{{ card.game }}</div>
          <div>€{{ card.price }}</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'PopularPage',
  data() {
    return { cards: [] }
  },
  mounted() {
    axios.get('http://localhost:5000/api/popular')
      .then(res => { this.cards = res.data })
      .catch(() => { this.cards = [] })
  }
}
</script>

<style scoped>
.popular-page {
  min-height: 100vh;
  padding: 2em;
  background: #e0f5e9;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  width: 100%;
  margin-top: 2em;
}
.card-item-link {
  text-decoration: none;
}
.card-item {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px #0002;
  width: 220px;
  padding: 1em;
  text-align: center;
  transition: transform 0.2s;
  cursor: pointer;
}
.card-item:hover {
  transform: scale(1.05);
}
.card-img {
  width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
  background: #eee;
  margin-bottom: 0.5em;
  box-shadow: 0 2px 8px #0001;
  display: block;
}
</style>
