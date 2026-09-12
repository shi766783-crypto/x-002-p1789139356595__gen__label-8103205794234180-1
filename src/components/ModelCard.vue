<script setup>
defineProps({
  model: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
})

const emit = defineEmits(['open', 'favorite'])
</script>

<template>
  <article class="model-card">
    <button class="model-card__image" type="button" @click="emit('open', model)">
      <img :src="model.cover" :alt="model.name" />
      <span class="model-card__type">{{ model.category }}</span>
      <span class="model-card__open">查看结构 <b>↗</b></span>
    </button>
    <div class="model-card__body">
      <div class="model-card__title-row">
        <div>
          <p class="eyebrow">{{ model.visual === 'custom' ? 'USER MODEL' : 'PRESET MODEL' }} · {{ model.stats.parts }} PARTS</p>
          <h3>{{ model.name }}</h3>
        </div>
        <button
          class="icon-button favorite-button"
          :class="{ selected: favorite }"
          type="button"
          :title="favorite ? '取消收藏' : '收藏设备'"
          @click="emit('favorite', model)"
        >
          {{ favorite ? '★' : '☆' }}
        </button>
      </div>
      <p class="model-card__description">{{ model.description }}</p>
      <div class="model-card__footer">
        <span><i class="mini-line"></i> {{ model.stats.complexity }}结构</span>
        <span>{{ model.stats.views }} 次探索</span>
      </div>
    </div>
  </article>
</template>
