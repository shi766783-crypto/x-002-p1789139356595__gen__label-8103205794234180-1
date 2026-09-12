<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  models: { type: Array, required: true },
  activity: { type: Object, required: true },
})

const activeMetric = ref('views')
const metrics = [
  { id: 'views', label: '浏览热度', unit: 'EXPLORED' },
  { id: 'detail', label: '讲解详尽度', unit: 'DEPTH' },
  { id: 'custom', label: '用户作品', unit: 'CREATED' },
]

const rankedModels = computed(() => {
  return [...props.models].sort((a, b) => {
    if (activeMetric.value === 'views') return (props.activity.views[b.id] || b.stats.views) - (props.activity.views[a.id] || a.stats.views)
    if (activeMetric.value === 'detail') return b.parts.reduce((sum, part) => sum + part.description.length + part.material.length, 0) - a.parts.reduce((sum, part) => sum + part.description.length + part.material.length, 0)
    return (b.visual === 'custom') - (a.visual === 'custom') || b.parts.length - a.parts.length
  })
})
</script>

<template>
  <main class="page-shell rankings-page">
    <section class="rankings-intro"><div><p class="eyebrow">COMMUNITY INDEX / LOCAL DATA</p><h1>探索有迹可循。</h1><p>从大家反复打开的模型，到最值得细读的部件说明，看看工作坊里的结构热度。</p></div><div class="rankings-mark">R<br />K</div></section>
    <div class="ranking-tabs"><button v-for="metric in metrics" :key="metric.id" type="button" :class="{ active: activeMetric === metric.id }" @click="activeMetric = metric.id"><span>{{ metric.unit }}</span>{{ metric.label }} <b>↗</b></button></div>
    <section class="ranking-list">
      <div class="ranking-list__header"><span>RANK</span><span>MODEL</span><span>PARTS</span><span>SCORE</span></div>
      <article v-for="(model, index) in rankedModels" :key="model.id" class="ranking-row" :class="{ 'ranking-row--top': index < 3 }">
        <div class="ranking-number">{{ String(index + 1).padStart(2, '0') }}</div>
        <div class="ranking-model"><img :src="model.cover" :alt="model.name" /><div><span class="eyebrow">{{ model.category }}</span><strong>{{ model.name }}</strong></div></div>
        <div class="ranking-parts">{{ model.parts.length }} <span>COMPONENTS</span></div>
        <div class="ranking-score"><strong>{{ activeMetric === 'views' ? (activity.views[model.id] || model.stats.views) : activeMetric === 'detail' ? Math.min(99, 58 + model.parts.length * 4) : model.visual === 'custom' ? 100 : 12 }}</strong><span>{{ metrics.find((metric) => metric.id === activeMetric).unit }}</span></div>
      </article>
    </section>
    <div class="ranking-footnote"><span>LOCAL SCORE / 2026</span><p>排行仅使用当前浏览器中的探索记录与模型资料计算，重新打开仍会保留。</p></div>
  </main>
</template>
