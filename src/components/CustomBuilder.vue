<script setup>
import { computed, ref } from 'vue'
import { createCustomDevice } from '../data/models'

const emit = defineEmits(['back', 'saved'])
const name = ref('')
const category = ref('家用电器')
const description = ref('')
const image = ref('')
const fileInput = ref(null)
const parts = ref([])
const drawing = ref(false)
const draftRegion = ref(null)
const canvasRef = ref(null)
const message = ref('')

const canSave = computed(() => name.value.trim() && image.value && parts.value.length)

function triggerUpload() {
  fileInput.value?.click()
}

function handleFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { image.value = reader.result }
  reader.readAsDataURL(file)
}

function pointerPosition(event) {
  const rect = canvasRef.value.getBoundingClientRect()
  return {
    left: Math.max(0, Math.min(94, ((event.clientX - rect.left) / rect.width) * 100)),
    top: Math.max(0, Math.min(88, ((event.clientY - rect.top) / rect.height) * 100)),
  }
}

function startRegion(event) {
  if (!image.value) return
  drawing.value = true
  const start = pointerPosition(event)
  draftRegion.value = { ...start, width: 0, height: 0 }
}

function updateRegion(event) {
  if (!drawing.value || !draftRegion.value) return
  const current = pointerPosition(event)
  draftRegion.value.width = Math.max(2, current.left - draftRegion.value.left)
  draftRegion.value.height = Math.max(2, current.top - draftRegion.value.top)
}

function finishRegion() {
  if (!drawing.value || !draftRegion.value || draftRegion.value.width < 3 || draftRegion.value.height < 3) {
    drawing.value = false
    draftRegion.value = null
    return
  }
  const region = { ...draftRegion.value }
  const newPart = {
    id: `draft-${Date.now()}`,
    name: `未命名部件 ${parts.value.length + 1}`,
    description: '请补充这个部件的功能描述。',
    material: '待补充',
    faults: '待补充',
    position: { left: region.left, top: region.top },
    size: { width: region.width, height: region.height },
  }
  parts.value.push(newPart)
  drawing.value = false
  draftRegion.value = null
  message.value = '已添加区域，请在右侧补充部件资料。'
}

function removePart(id) {
  parts.value = parts.value.filter((part) => part.id !== id)
}

function save() {
  if (!canSave.value) {
    message.value = '请先上传图片、填写设备名称，并至少标记一个部件。'
    return
  }
  const device = createCustomDevice({
    name: name.value.trim(),
    category: category.value,
    description: description.value.trim() || '这是一个由我创建的设备结构模型。',
    coverImage: image.value,
    parts: parts.value,
  })
  emit('saved', device)
}
</script>

<template>
  <main class="page-shell builder-page">
    <div class="builder-header">
      <button class="back-button" type="button" @click="emit('back')"><span>←</span> 返回</button>
      <div><p class="eyebrow">USER MODEL / WORKSHOP</p><h1>建立我的结构模型</h1></div>
      <button class="primary-button" type="button" :disabled="!canSave" @click="save">保存作品 <span>↗</span></button>
    </div>
    <div class="builder-layout">
      <section class="builder-canvas-panel">
        <div class="panel-heading"><div><p class="eyebrow">STEP 01 / UPLOAD & MARK</p><h2>标记部件区域</h2></div><span class="step-counter">{{ parts.length }} PARTS</span></div>
        <div v-if="!image" class="upload-dropzone" @click="triggerUpload">
          <div class="upload-symbol">＋</div><h3>上传一张设备图片</h3><p>支持 JPG / PNG，图片只会保存在当前浏览器。</p><button class="secondary-button" type="button">选择图片</button>
        </div>
        <div v-else ref="canvasRef" class="builder-canvas" @mousedown="startRegion" @mousemove="updateRegion" @mouseup="finishRegion" @mouseleave="finishRegion">
          <img :src="image" alt="待标记的设备" />
          <div v-for="part in parts" :key="part.id" class="builder-region" :style="{ left: `${part.position.left}%`, top: `${part.position.top}%`, width: `${part.size.width}%`, height: `${part.size.height}%` }"><span>{{ part.name }}</span></div>
          <div v-if="draftRegion" class="builder-region draft" :style="{ left: `${draftRegion.left}%`, top: `${draftRegion.top}%`, width: `${draftRegion.width}%`, height: `${draftRegion.height}%` }"></div>
          <div class="builder-canvas__tip">按住鼠标拖拽，框选一个部件</div>
        </div>
        <input ref="fileInput" class="visually-hidden" type="file" accept="image/*" @change="handleFile" />
      </section>
      <aside class="builder-form">
        <div class="panel-heading"><div><p class="eyebrow">STEP 02 / DESCRIBE</p><h2>模型资料</h2></div></div>
        <label class="field-label">设备名称<input v-model="name" type="text" placeholder="例如：我的老式收音机" /></label>
        <label class="field-label">设备类别<select v-model="category"><option>家用电器</option><option>交通工具</option><option>机械工具</option><option>其他</option></select></label>
        <label class="field-label">整体简介<textarea v-model="description" rows="4" placeholder="它是什么？核心工作原理是什么？"></textarea></label>
        <div class="builder-parts-heading"><span class="eyebrow">MARKED PARTS / {{ parts.length }}</span><span class="parts-hint">框选后编辑</span></div>
        <div v-if="!parts.length" class="parts-empty">还没有部件。<br />在左侧图片上拖拽框选。</div>
        <div v-for="(part, index) in parts" :key="part.id" class="draft-part">
          <div class="draft-part__top"><span class="draft-part__index">0{{ index + 1 }}</span><button class="delete-button" type="button" title="删除部件" @click="removePart(part.id)">×</button></div>
          <input v-model="part.name" class="draft-part__name" type="text" placeholder="部件名称" />
          <textarea v-model="part.description" rows="2" placeholder="功能描述"></textarea>
          <div class="draft-part__split"><input v-model="part.material" type="text" placeholder="材质" /><input v-model="part.faults" type="text" placeholder="常见故障" /></div>
        </div>
        <p v-if="message" class="builder-message">{{ message }}</p>
      </aside>
    </div>
  </main>
</template>
