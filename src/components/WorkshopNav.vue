<script setup>
import BrandMark from './BrandMark.vue'

defineProps({
  view: { type: String, required: true },
  customCount: { type: Number, default: 0 },
})

const emit = defineEmits(['change'])

const navItems = [
  { id: 'library', label: '模型库', icon: '▦' },
  { id: 'search', label: '部件检索', icon: '⌕' },
  { id: 'custom', label: '自定义建模', icon: '＋' },
  { id: 'rankings', label: '探索排行', icon: '↗' },
  { id: 'profile', label: '我的工作台', icon: '○' },
]
</script>

<template>
  <header class="topbar">
    <BrandMark />
    <nav class="main-nav" aria-label="主导航">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: view === item.id }"
        type="button"
        @click="emit('change', item.id)"
      >
        <span class="nav-item__icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
        <em v-if="item.id === 'custom' && customCount">{{ customCount }}</em>
      </button>
    </nav>
    <div class="topbar__status">
      <span class="status-dot"></span>
      本地工作区
      <button class="avatar-button" type="button" title="打开个人中心" @click="emit('change', 'profile')">LX</button>
    </div>
  </header>
</template>
