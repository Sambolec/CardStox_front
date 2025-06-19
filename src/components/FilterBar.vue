<template>
  <div class="filter-bar">
    <button
      v-for="game in games"
      :key="game"
      :class="{ active: game === selectedGame }"
      @click="$emit('changeGame', game)"
    >{{ game }}</button>
  </div>
</template>

<script>
export default {
  name: 'FilterBar',
  props: ['selectedGame'],
  data() {
    return {
      games: ['All', 'Pokemon', 'Yu-Gi-Oh', 'MTG']
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 1em;
  justify-content: center;
  margin-bottom: 1.5em;
}
button {
  background: #6b4f27;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5em 1.5em;
  font-size: 1em;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;
}
button.active, button:hover {
  background: #b8d8ba;
  color: #6b4f27;
}
</style>
