<template>
  <div class="detail">
    <button @click="$router.back()" class="back-btn">← Back</button>
    <div class="detail-card" v-if="card && card.name">
      <img :src="card.image" :alt="card.name" class="detail-img" />
      <div class="detail-info">
        <h2>{{ card.name }}</h2>
        <div><b>Game:</b> {{ card.game }}</div>
        <div><b>Set:</b> {{ card.set }}</div>
        <div><b>Price:</b> €{{ card.price }}</div>
        <div class="card-actions">
          <button v-if="showBuy" @click="buyCard" class="buy-btn">Buy</button>
          <button v-if="showWishlist" @click="wishlistCard" class="wishlist-btn">Add to Wishlist</button>
          <button
            v-if="showSell"
            @click="sellCard"
            class="sell-btn"
            style="margin-left:1em"
          >
            Sell
          </button>
        </div>
        <div v-if="chartData" class="chart-section">
          <h3>Market Price History</h3>
          <div class="chart-container">
            <LineChart :chartData="chartData" :chartOptions="chartOptions" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      Loading card details...
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import LineChart from '../components/LineChart.vue'

export default {
  name: 'CardDetail',
  components: { LineChart },
  data() {
    return {
      card: {},
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: 'Price (€)' }
          },
          x: {
            title: { display: true, text: 'Date' }
          }
        },
        plugins: { legend: { display: false } }
      },
      user: null
    }
  },
  async mounted() {
    const id = this.$route.params.id
    const res = await axios.get(`http://localhost:5000/api/cards/${id}`)
    this.card = res.data

    // Fetch user profile to check ownership
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.user = userRes.data;
      } catch (err) {
        // Optionally handle error (do nothing)
      }
    }

    if (this.card.priceHistory && this.card.priceHistory.length) {
      this.chartData = {
        labels: this.card.priceHistory.map(p => p.date),
        datasets: [
          {
            label: 'Market Price',
            data: this.card.priceHistory.map(p => p.price),
            borderColor: '#6b4f27',
            backgroundColor: 'rgba(107,79,39,0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: '#6b4f27'
          }
        ]
      }
    }
  },
  computed: {
    showBuy() {
      return (
        this.user &&
        !this.user.bought.some(c => c._id === this.card._id) &&
        !this.user.sold.some(c => c._id === this.card._id)
      );
    },
    showWishlist() {
      return (
        this.user &&
        !this.user.wishlist.some(c => c._id === this.card._id) &&
        !this.user.bought.some(c => c._id === this.card._id) &&
        !this.user.sold.some(c => c._id === this.card._id)
      );
    },
    showSell() {
      return (
        this.user &&
        this.user.bought.some(c => c._id === this.card._id)
      );
    }
  },
  methods: {
    async buyCard() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to buy cards.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.post(`http://localhost:5000/api/buy/${this.card._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Card bought! Check your profile.');
        this.$router.push('/profile');
      } catch (err) {
        alert('Failed to buy card.');
      }
    },
    async wishlistCard() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to wishlist cards.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.post(`http://localhost:5000/api/wishlist/${this.card._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Card wishlisted! Check your profile.');
        this.$router.push('/profile');
      } catch (err) {
        alert('Failed to wishlist card.');
      }
    },
    async sellCard() {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in.');
        this.$router.push('/login');
        return;
      }
      try {
        await axios.post(`http://localhost:5000/api/sell/${this.card._id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Card sold!');
        this.$router.push('/profile');
      } catch (err) {
        alert('Failed to sell card.');
      }
    }
  }
}
</script>

<style scoped>
.detail {
  background: #b8d8ba;
  min-height: 100vh;
  padding: 2em;
}
.back-btn {
  background: none;
  border: none;
  color: #6b4f27;
  font-size: 1.2em;
  margin-bottom: 1em;
  cursor: pointer;
}
.detail-card {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 16px #0002;
  display: flex;
  flex-direction: row;
  gap: 2em;
  padding: 2em;
  max-width: 900px;
  margin: auto;
  align-items: flex-start;
}
.detail-img {
  width: 250px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0001;
}
.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.card-actions {
  display: flex;
  gap: 1em;
  margin: 1em 0 2em 0;
}
.buy-btn {
  background: #6dc0a6;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.7em 1.5em;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.buy-btn:hover {
  background: #4b3c1a;
}
.wishlist-btn {
  background: #f9d66a;
  color: #6b4f27;
  border: none;
  border-radius: 14px;
  padding: 0.7em 1.5em;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.wishlist-btn:hover {
  background: #ffe9a7;
}
.sell-btn {
  background: #c0392b;
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 0.7em 1.5em;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.sell-btn:hover {
  background: #a93226;
}
.chart-section {
  margin-top: 2em;
  width: 100%;
}
.chart-container {
  width: 100%;
  max-width: 500px;
  height: 300px;
  margin: 1em auto 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media (max-width: 900px) {
  .detail-card {
    flex-direction: column;
    align-items: center;
    max-width: 98vw;
    padding: 1em;
  }
  .chart-container {
    max-width: 98vw;
    min-width: 0;
  }
}
.loading {
  color: #4b3c1a;
  font-size: 1.5em;
  margin-top: 2em;
}
</style>
