<script setup>
import { computed } from 'vue'

const props = defineProps({
  model: { type: Object, required: true },
  selectedPartId: { type: String, default: '' },
  mode: { type: String, default: 'explore' },
  deconstructStep: { type: Number, default: 0 },
  flashPartId: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const svgTemplates = {
  fan: `
    <g class="diagram-lines">
      <path d="M32 56 C33 30 67 22 86 40 C96 50 93 78 76 87 C51 100 30 83 32 56Z" />
      <circle cx="62" cy="60" r="25" />
      <path d="M62 60 C47 41 41 51 49 61 C54 67 60 66 62 60Z" class="fill-accent" />
      <path d="M66 60 C83 46 83 60 75 65 C68 70 65 67 66 60Z" class="fill-soft" />
      <path d="M62 65 C76 81 62 82 55 75 C49 69 55 64 62 65Z" class="fill-accent" />
      <path d="M58 60 C42 73 42 60 50 54 C56 50 60 54 58 60Z" class="fill-soft" />
      <path d="M62 85 V116 M42 119 H82" />
      <path d="M44 89 C36 87 31 93 30 100 H94 C91 92 85 87 77 89" />
    </g>`,
  bike: `
    <g class="diagram-lines">
      <circle cx="24" cy="83" r="16" /><circle cx="77" cy="83" r="16" />
      <path d="M24 83 L42 51 L61 83 Z M42 51 L58 51 L77 83 M42 51 L50 83 M50 83 H61" />
      <path d="M42 51 L37 41 M34 41 H42 M58 51 L65 40 M62 40 H70" />
      <circle cx="50" cy="83" r="5" class="fill-accent" />
      <path d="M30 78 C42 68 59 68 72 78" class="stroke-soft" />
    </g>`,
  engine: `
    <g class="diagram-lines">
      <rect x="24" y="30" width="54" height="50" rx="4" />
      <path d="M31 30 V20 H43 V30 M48 30 V20 H60 V30 M65 30 V20 H77 V30" />
      <path d="M31 45 H72 M31 59 H72 M31 73 H72" class="stroke-accent" />
      <circle cx="40" cy="90" r="8" /><circle cx="65" cy="90" r="8" />
      <path d="M45 45 C54 36 61 52 70 44" class="stroke-warm" />
    </g>`,
  custom: `
    <g class="diagram-lines"><rect x="18" y="22" width="66" height="72" rx="4" class="stroke-soft" /><path d="M27 38 H74 M27 54 H65 M27 70 H72" /></g>`,
}

const isPartVisible = (part, index) => {
  if (props.mode === 'explore') return true
  if (props.mode === 'explode') return true
  return index <= props.deconstructStep
}

const partStyle = (part, index) => {
  const x = props.mode === 'explore' ? 0 : props.mode === 'explode' ? part.offset.x * 1.9 : part.offset.x * (index <= props.deconstructStep ? 1.45 : 0)
  const y = props.mode === 'explore' ? 0 : props.mode === 'explode' ? part.offset.y * 1.9 : part.offset.y * (index <= props.deconstructStep ? 1.45 : 0)
  return {
    left: `${part.position.left}%`,
    top: `${part.position.top}%`,
    width: `${part.size.width}%`,
    height: `${part.size.height}%`,
    '--part-color': part.color,
    '--move-x': `${x}px`,
    '--move-y': `${y}px`,
    zIndex: part.id === props.selectedPartId ? 30 : index + 2,
  }
}

const visibleParts = computed(() => props.model.parts.filter((part, index) => isPartVisible(part, index)))
</script>

<template>
  <div class="structure-canvas" :class="[`visual-${model.visual}`, `mode-${mode}`]">
    <div class="canvas-grid"></div>
    <div class="canvas-label canvas-label--top">STRUCTURAL MAP / {{ model.visual.toUpperCase() }}</div>
    <div class="canvas-label canvas-label--bottom">X: 00—100 / Y: 00—100</div>
    <svg class="base-diagram" viewBox="0 0 100 130" aria-hidden="true">
      <g transform="translate(8 8) scale(.84)" v-html="svgTemplates[model.visual]"></g>
    </svg>
    <div
      v-for="(part, index) in visibleParts"
      :key="part.id"
      class="part-hotspot"
      :class="{ selected: selectedPartId === part.id, flash: flashPartId === part.id, ghost: mode === 'explode' }"
      :style="partStyle(part, index)"
      role="button"
      tabindex="0"
      @click="emit('select', part)"
      @keydown.enter="emit('select', part)"
    >
      <span class="part-hotspot__number">{{ part.code }}</span>
      <span class="part-hotspot__pin" :style="{ backgroundColor: part.color }"></span>
      <span class="part-hotspot__label">{{ part.name }}</span>
      <span v-if="flashPartId === part.id" class="part-hotspot__ring" aria-hidden="true"></span>
    </div>
    <div v-if="flashPartId" class="canvas-hint canvas-hint--locate" role="status">
      <span>◎</span> 已定位到部件 / {{ model.parts.find((item) => item.id === flashPartId)?.name }}
    </div>
    <div v-if="mode === 'deconstruct' && deconstructStep < model.parts.length - 1" class="canvas-hint">
      <span>↘</span> 第 {{ deconstructStep + 1 }} 层已分离
    </div>
    <div v-if="mode === 'explode'" class="canvas-hint canvas-hint--explode">
      <span>✦</span> EXPLODED VIEW / 全部部件
    </div>
  </div>
</template>
