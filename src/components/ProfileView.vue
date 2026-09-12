<script setup>
import { computed } from 'vue'
import ModelCard from './ModelCard.vue'

const props = defineProps({
  models: { type: Array, required: true },
  customDevices: { type: Array, required: true },
  activity: { type: Object, required: true },
  favorites: { type: Array, required: true },
})
const emit = defineEmits(['open', 'favorite'])

const favoriteModels = computed(() => props.models.filter((model) => props.favorites.includes(model.id)))
const historyModels = computed(() => props.activity.history.map((item) => props.models.find((model) => model.id === item.deviceId)).filter(Boolean))
</script>

<template>
  <main class="page-shell profile-page">
    <section class="profile-header"><div class="profile-avatar">LX</div><div><p class="eyebrow">MY WORKSHOP / LOCAL PROFILE</p><h1>林小新 <span>的工作台</span></h1><p>在这里管理你创建的结构、收藏的模型和最近浏览。</p></div><div class="profile-stat"><strong>{{ customDevices.length }}</strong><span>我的作品</span></div><div class="profile-stat"><strong>{{ activity.history.length }}</strong><span>浏览记录</span></div></section>
    <section class="profile-grid">
      <div class="profile-main">
        <div class="section-heading profile-section-heading"><div><p class="eyebrow">MY CREATIONS</p><h2>我的作品</h2></div><span>{{ customDevices.length }} MODELS</span></div>
        <div v-if="customDevices.length" class="profile-model-grid"><ModelCard v-for="model in customDevices" :key="model.id" :model="model" :favorite="favorites.includes(model.id)" @open="emit('open', $event)" @favorite="emit('favorite', $event)" /></div>
        <div v-else class="profile-empty"><span>＋</span><div><h3>还没有自己的模型</h3><p>上传一张照片，开始标记第一个部件。</p></div></div>
      </div>
      <aside class="profile-side">
        <div class="section-heading profile-section-heading"><div><p class="eyebrow">RECENTLY EXPLORED</p><h2>最近浏览</h2></div></div>
        <div v-if="historyModels.length" class="history-list"><button v-for="(model, index) in historyModels" :key="model.id" type="button" @click="emit('open', model)"><span>0{{ index + 1 }}</span><img :src="model.cover" :alt="model.name" /><strong>{{ model.name }}</strong><em>↗</em></button></div>
        <p v-else class="small-empty">打开一个模型后，它会出现在这里。</p>
        <div class="profile-side__divider"></div>
        <div class="section-heading profile-section-heading"><div><p class="eyebrow">SAVED MODELS</p><h2>我的收藏</h2></div><span>{{ favoriteModels.length }}</span></div>
        <div v-if="favoriteModels.length" class="saved-list"><button v-for="model in favoriteModels" :key="model.id" type="button" @click="emit('open', model)"><span :style="{ backgroundImage: `url(${model.cover})` }"></span><strong>{{ model.shortName }}</strong><em>★</em></button></div>
        <p v-else class="small-empty">点击模型卡片上的星标，收藏值得反复查看的结构。</p>
      </aside>
    </section>
  </main>
</template>
