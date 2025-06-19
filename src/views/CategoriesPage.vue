<template>
  <div class="categories-page">
    <h1>Choose a Category</h1>
    <div class="category-grid" v-if="!selectedGame">
      <div
        v-for="cat in categories"
        :key="cat.name"
        class="category-card"
        @click="selectGame(cat.name)"
      >
        <img :src="cat.image" :alt="cat.name" class="category-img" />
        <div class="category-title">{{ cat.name }}</div>
      </div>
    </div>
    <div v-else>
      <button class="back-btn" @click="selectedGame = null">← Back to categories</button>
      <h2>{{ selectedGame }} Cards</h2>
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
            <h3>{{ card.name }}</h3>
            <div>{{ card.game }}</div>
            <div>€{{ card.price }}</div>
          </div>
        </router-link>
      </div>
      <div v-if="filteredCards.length === 0" class="no-cards">
        No cards found for this category.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CategoriesPage',
  data() {
    return {
      categories: [
        {
          name: 'Magic: The Gathering',
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMHB8kaDsWa8aYZyRyIB-yQgAHzTOGm7f0qw&s'
        },
        {
          name: 'Pokemon',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Pok%C3%A9mon_Trading_Card_Game_logo.svg/1200px-Pok%C3%A9mon_Trading_Card_Game_logo.svg.png'
        },
        {
          name: 'Yu-Gi-Oh!',
          image: 'https://yt3.googleusercontent.com/ytc/AIdro_lHGTyx4ClKJ6Dep4-YOgMumyrWZTXD-rhFassCPLUdMgU=s900-c-k-c0x00ffffff-no-rj'
        }
      ],
      cards: [],
      selectedGame: null
    }
  },
  computed: {
    filteredCards() {
      if (!this.selectedGame) return [];
      return this.cards.filter(card => card.game === this.selectedGame);
    }
  },
  methods: {
    selectGame(game) {
      this.selectedGame = game;
      if (this.cards.length === 0) {
        axios.get('http://localhost:5000/api/cards')
          .then(res => { this.cards = res.data; })
          .catch(() => { this.cards = []; });
      }
    }
  }
}
</script>

<style scoped>
.categories-page {
  min-height: 100vh;
  background: #6dc0a6;
  padding: 2em;
  text-align: center;
}
h1 {
  color: #6b4f27;
  font-family: 'Montserrat', sans-serif;
  margin-bottom: 2em;
}
.category-grid {
  display: flex;
  justify-content: center;
  gap: 2em;
  margin-bottom: 2em;
}
.category-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 16px #0002;
  width: 260px;
  padding: 1.5em 1em;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.category-card:hover {
  transform: scale(1.05);
}
.category-img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 12px;
  background: #eee;
  margin-bottom: 1em;
}
.category-title {
  font-size: 1.2em;
  color: #6b4f27;
  font-weight: bold;
  font-family: 'Montserrat', sans-serif;
}
.back-btn {
  background: #6b4f27;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.5em 1.5em;
  margin-bottom: 2em;
  cursor: pointer;
  font-size: 1em;
}
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: center;
  width: 100%;
  margin-bottom: 2em;
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
  height: 160px;
  object-fit: contain;
  border-radius: 8px;
  background: #eee;
  margin-bottom: 0.5em;
  box-shadow: 0 2px 8px #0001;
  display: block;
}
.no-cards {
  color: #6b4f27;
  margin-top: 2em;
  font-size: 1.2em;
}
</style>
