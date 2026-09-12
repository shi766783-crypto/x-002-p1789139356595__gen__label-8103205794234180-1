<script setup>
defineProps({
  model: { type: Object, required: true },
  part: { type: Object, required: true },
  mode: { type: String, required: true },
})

const emit = defineEmits(['close'])
</script>

<template>
  <aside class="part-inspector">
    <div class="inspector-header">
      <span class="eyebrow">COMPONENT DETAIL / {{ part.code }}</span>
      <button class="icon-button" type="button" title="关闭部件详情" @click="emit('close')">×</button>
    </div>
    <div class="inspector-title">
      <span class="part-dot" :style="{ background: part.color }"></span>
      <div>
        <h2>{{ part.name }}</h2>
        <p>{{ model.name }}</p>
      </div>
    </div>
    <div class="inspector-section">
      <p class="eyebrow">FUNCTION / 功能</p>
      <p>{{ part.description }}</p>
    </div>
    <div class="inspector-facts">
      <div>
        <span class="eyebrow">MATERIAL</span>
        <strong>{{ part.material }}</strong>
      </div>
      <div>
        <span class="eyebrow">POSITION</span>
        <strong>{{ Math.round(part.position.left) }}, {{ Math.round(part.position.top) }}</strong>
      </div>
    </div>
    <div class="inspector-section inspector-section--warning">
      <p class="eyebrow">COMMON FAILURE / 常见故障</p>
      <p>{{ part.faults }}</p>
    </div>
    <div class="inspector-chain">
      <div>
        <span class="chain-label">父部件</span>
        <strong>{{ part.parentId ? model.parts.find((item) => item.id === part.parentId)?.name : '根部件 / 总成' }}</strong>
      </div>
      <span class="chain-arrow">→</span>
      <div>
        <span class="chain-label">子部件</span>
        <strong>{{ part.children?.length ? part.children.map((id) => model.parts.find((item) => item.id === id)?.name).join('、') : '无' }}</strong>
      </div>
    </div>
    <div class="inspector-mode-note">
      <span>{{ mode === 'explode' ? '✦' : 'i' }}</span>
      {{ mode === 'explode' ? '爆炸图已展开，当前可观察该部件与相邻部件的空间关系。' : '点击画布上的其他标记，可以继续查看部件资料。' }}
    </div>
  </aside>
</template>
