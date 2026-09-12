<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import PartInspector from './PartInspector.vue'
import StructureCanvas from './StructureCanvas.vue'

const props = defineProps({
  model: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
  initialPartId: { type: String, default: '' },
  returnLabel: { type: String, default: '模型库' },
})

const emit = defineEmits(['back', 'favorite'])
const mode = ref('explore')
const initialPart = props.model.parts.find((part) => part.id === props.initialPartId) || props.model.parts[0]
const selectedPart = ref(initialPart)
const deconstructStep = ref(0)
const flashPartId = ref(props.initialPartId)
const workbenchRef = ref(null)
let flashTimer = 0

onMounted(() => {
  if (!props.initialPartId) return
  nextTick(() => {
    workbenchRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  flashTimer = window.setTimeout(() => {
    flashPartId.value = ''
  }, 3600)
})

onBeforeUnmount(() => {
  window.clearTimeout(flashTimer)
})

const modeLabel = computed(() => ({
  explore: '浏览模式',
  deconstruct: '拆解模式',
  explode: '爆炸图',
}[mode.value]))

function setMode(nextMode) {
  mode.value = nextMode
  if (nextMode === 'deconstruct') deconstructStep.value = Math.min(1, props.model.parts.length - 1)
  if (nextMode === 'explore') deconstructStep.value = 0
}

function nextStep() {
  if (deconstructStep.value >= props.model.parts.length - 1) {
    deconstructStep.value = 0
  } else {
    deconstructStep.value += 1
  }
}

function selectPart(part) {
  selectedPart.value = part
  flashPartId.value = ''
}
</script>

<template>
  <main class="detail-page">
    <div class="detail-topbar">
      <button class="back-button" type="button" @click="emit('back')"><span>←</span> 返回{{ returnLabel }}</button>
      <div class="detail-breadcrumb"><span>MODEL / {{ model.category.toUpperCase() }}</span><b>/</b><strong>{{ model.shortName }}</strong></div>
      <button class="icon-button favorite-button detail-favorite" :class="{ selected: favorite }" type="button" :title="favorite ? '取消收藏' : '收藏设备'" @click="emit('favorite')">{{ favorite ? '★' : '☆' }}</button>
    </div>

    <section class="detail-hero">
      <div>
        <p class="eyebrow">MODEL {{ model.visual === 'custom' ? 'USER' : 'PRESET' }} / {{ model.stats.parts }} COMPONENTS</p>
        <h1>{{ model.name }}</h1>
        <p>{{ model.description }}</p>
      </div>
      <div class="detail-stats">
        <div><strong>{{ model.stats.parts }}</strong><span>部件</span></div>
        <div><strong>{{ model.stats.complexity }}</strong><span>复杂度</span></div>
        <div><strong>{{ model.stats.views }}</strong><span>探索次数</span></div>
      </div>
    </section>

    <section ref="workbenchRef" class="detail-workbench">
      <div class="workbench-main">
        <div v-if="initialPartId" class="locate-banner" role="status">
          <span>◎</span> 来自部件检索：已为你定位到「{{ selectedPart?.name }}」，右侧为部件资料，画布中闪烁标记即为其位置。
        </div>
        <div class="workbench-toolbar">
          <div class="mode-switch">
            <button type="button" :class="{ active: mode === 'explore' }" @click="setMode('explore')">浏览</button>
            <button type="button" :class="{ active: mode === 'deconstruct' }" @click="setMode('deconstruct')">拆解 <span class="toolbar-key">D</span></button>
            <button type="button" :class="{ active: mode === 'explode' }" @click="setMode('explode')">爆炸图 <span class="toolbar-key">E</span></button>
          </div>
          <div class="workbench-toolbar__status"><i></i> {{ modeLabel }} <span v-if="mode === 'deconstruct'">· 层级 {{ deconstructStep + 1 }}/{{ model.parts.length }}</span></div>
        </div>
        <StructureCanvas :model="model" :selected-part-id="selectedPart?.id" :flash-part-id="flashPartId" :mode="mode" :deconstruct-step="deconstructStep" @select="selectPart" />
        <div v-if="mode === 'deconstruct'" class="deconstruct-control">
          <div>
            <p class="eyebrow">ASSEMBLY SEQUENCE</p>
            <strong>按层级还原装配顺序</strong>
          </div>
          <div class="sequence-progress"><span :style="{ width: `${((deconstructStep + 1) / model.parts.length) * 100}%` }"></span></div>
          <button class="primary-button small" type="button" @click="nextStep">{{ deconstructStep >= model.parts.length - 1 ? '重新播放' : '下一层' }} <span>→</span></button>
        </div>
      </div>
      <PartInspector v-if="selectedPart" :model="model" :part="selectedPart" :mode="mode" @close="selectedPart = null" />
    </section>

    <section class="detail-lower">
      <div class="principle-block">
        <div class="lower-heading"><span class="section-index">02</span><div><p class="eyebrow">WORKING PRINCIPLE</p><h2>它是如何工作的？</h2></div></div>
        <p>{{ model.principle }}</p>
      </div>
      <div class="connections-block">
        <div class="lower-heading"><span class="section-index">03</span><div><p class="eyebrow">CONNECTION LOGIC</p><h2>连接关系</h2></div></div>
        <ul><li v-for="connection in model.connections" :key="connection">{{ connection }}</li></ul>
      </div>
    </section>
  </main>
</template>
