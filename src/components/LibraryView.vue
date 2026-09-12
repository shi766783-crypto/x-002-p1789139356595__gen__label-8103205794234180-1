<script setup>
import { computed, ref } from 'vue'
import ModelCard from './ModelCard.vue'

const props = defineProps({
  models: { type: Array, required: true },
  favorites: { type: Array, default: () => [] },
})

const emit = defineEmits(['open', 'favorite', 'create'])
const activeCategory = ref('全部')
const search = ref('')
const categories = ['全部', '家用电器', '交通工具', '机械工具']

const filteredModels = computed(() => {
  return props.models.filter((model) => {
    const matchesCategory = activeCategory.value === '全部' || model.category === activeCategory.value
    const query = search.value.trim().toLowerCase()
    const matchesSearch = !query || `${model.name}${model.category}${model.description}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <main class="page-shell library-page">
    <section class="page-intro">
      <div>
        <p class="eyebrow">EXPLORATION INDEX / 2026</p>
        <h1>把熟悉的东西，<br /><em>拆开看。</em></h1>
        <p class="page-intro__copy">从一枚轴承到一台发动机，追踪每个部件的位置、材料与工作逻辑。选择一个模型开始探索。</p>
      </div>
      <div class="intro-metric">
        <span class="intro-metric__number">{{ models.length }}</span>
        <span class="intro-metric__label">可探索模型<br />LOCAL LIBRARY</span>
      </div>
    </section>

    <section class="library-toolbar" aria-label="模型筛选">
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category }}
        </button>
      </div>
      <label class="search-box">
        <span>⌕</span>
        <input v-model="search" type="search" placeholder="搜索设备、部件或原理" />
      </label>
    </section>

    <section class="section-heading">
      <div>
        <p class="eyebrow">START HERE</p>
        <h2>预设模型库</h2>
      </div>
      <button class="text-button" type="button" @click="emit('create')">建立我的模型 <span>＋</span></button>
    </section>

    <section class="model-grid">
      <ModelCard
        v-for="model in filteredModels"
        :key="model.id"
        :model="model"
        :favorite="favorites.includes(model.id)"
        @open="emit('open', $event)"
        @favorite="emit('favorite', $event)"
      />
      <div v-if="!filteredModels.length" class="empty-state">
        <span>∅</span>
        <h3>没有找到匹配的模型</h3>
        <p>换个关键词，或建立一个属于你的设备。</p>
      </div>
    </section>

    <section class="library-note">
      <span class="library-note__index">01</span>
      <div>
        <p class="eyebrow">HOW IT WORKS</p>
        <p>先看整体，再选部件。进入详情后，可以用“拆解模式”按安装层级逐步分离，也可以用“爆炸图”一次看清全部连接关系。</p>
      </div>
      <div class="library-note__line"></div>
      <span class="library-note__index">03</span>
    </section>
  </main>
</template>
