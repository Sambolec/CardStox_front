<template>
  <div class="card-item">
    <div v-if="card">
      <img :src="card.image" alt="card.name" class="card-img" />
      <h3>{{ card.name }}</h3>
      <div>{{ card.game }}</div>
      <div>€{{ card.price }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardItem',
  props: ['card']
}
</script>

<style scoped>
.card-item {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 12px #0002;
  width: 220px;
  padding: 1em;
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
}
.card-item:hover {
  transform: scale(1.05);
}
.card-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 0.5em;
}
</style>
