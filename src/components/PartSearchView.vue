<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  models: { type: Array, required: true },
})

const emit = defineEmits(['open'])

const search = ref('')
const hotKeywords = ['电机', '链条', '锈蚀', '铝合金', '异响', '活塞']

const SEARCH_FIELDS = [
  { key: 'name', label: '名称' },
  { key: 'code', label: '编号' },
  { key: 'material', label: '材质' },
  { key: 'faults', label: '故障' },
  { key: 'description', label: '功能' },
]

const tokens = computed(() => search.value.trim().toLowerCase().split(/\s+/).filter(Boolean))
const hasQuery = computed(() => tokens.value.length > 0)

const totalParts = computed(() => props.models.reduce((sum, model) => sum + model.parts.length, 0))

function partHaystack(part) {
  return SEARCH_FIELDS.map((field) => String(part[field.key] ?? '').toLowerCase()).join('\n')
}

function matchPart(part) {
  const haystack = partHaystack(part)
  if (!tokens.value.every((token) => haystack.includes(token))) return null
  const matchedFields = SEARCH_FIELDS.filter((field) => {
    const value = String(part[field.key] ?? '').toLowerCase()
    return tokens.value.some((token) => value.includes(token))
  }).map((field) => field.label)
  return { part, matchedFields }
}

const groups = computed(() => {
  if (!hasQuery.value) return []
  return props.models
    .map((model) => ({ model, hits: model.parts.map(matchPart).filter(Boolean) }))
    .filter((group) => group.hits.length > 0)
})

const hitCount = computed(() => groups.value.reduce((sum, group) => sum + group.hits.length, 0))

// 把命中的关键词片段包进 <mark>，先转义再替换，避免注入与标签自匹配
function highlight(text) {
  const escaped = String(text ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]))
  if (!tokens.value.length) return escaped
  const pattern = tokens.value
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  return escaped.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>')
}

function useKeyword(keyword) {
  search.value = keyword
}

function openPart(model, part) {
  emit('open', model, part.id)
}
</script>

<template>
  <main class="page-shell part-search-page">
    <section class="page-intro">
      <div>
        <p class="eyebrow">COMPONENT INDEX / CROSS-DEVICE</p>
        <h1>找一个部件，<br /><em>不必翻遍每台设备。</em></h1>
        <p class="page-intro__copy">输入部件名称、材质或常见故障关键词，跨全部设备检索。结果按所属设备分组，点击即可直达结构详情并定位到该部件。</p>
      </div>
      <div class="intro-metric">
        <span class="intro-metric__number">{{ totalParts }}</span>
        <span class="intro-metric__label">已索引部件<br />{{ models.length }} DEVICES</span>
      </div>
    </section>

    <section class="part-search-bar" aria-label="部件检索">
      <label class="part-search-input">
        <span>⌕</span>
        <input v-model="search" type="search" placeholder="输入部件名 / 材质 / 故障关键词，如：电机、锈蚀、链条" autofocus />
        <button v-if="search" type="button" class="part-search-clear" title="清空关键词" @click="search = ''">×</button>
      </label>
      <div class="part-search-hints">
        <span class="parts-hint">试试</span>
        <button v-for="keyword in hotKeywords" :key="keyword" type="button" @click="useKeyword(keyword)">{{ keyword }}</button>
      </div>
    </section>

    <section v-if="!hasQuery" class="empty-state part-search-placeholder">
      <span>⌕</span>
      <h3>输入关键词，开始跨设备检索</h3>
      <p>支持部件名称、编号、材质、功能描述与常见故障。多个关键词用空格分隔，可同时缩小范围。</p>
    </section>

    <section v-else-if="!groups.length" class="empty-state part-search-placeholder">
      <span>∅</span>
      <h3>没有找到包含“{{ search.trim() }}”的部件</h3>
      <p>已检索全部 {{ models.length }} 台设备的 {{ totalParts }} 个部件。请检查拼写，或换用更短、更通用的关键词（如材质名或故障现象）。</p>
      <div class="part-search-hints part-search-hints--empty">
        <span class="parts-hint">建议关键词</span>
        <button v-for="keyword in hotKeywords.slice(0, 4)" :key="keyword" type="button" @click="useKeyword(keyword)">{{ keyword }}</button>
      </div>
    </section>

    <template v-else>
      <div class="part-search-summary parts-hint">
        命中 <strong>{{ hitCount }}</strong> 个部件 · 分布在 <strong>{{ groups.length }}</strong> 台设备
      </div>

      <section v-for="group in groups" :key="group.model.id" class="part-search-group">
        <header class="part-search-group__header">
          <img :src="group.model.cover" :alt="group.model.name" />
          <div>
            <p class="eyebrow">{{ group.model.category }} / {{ group.hits.length }} MATCH</p>
            <h2>{{ group.model.name }}</h2>
          </div>
          <span class="part-search-group__count">{{ group.hits.length }}</span>
        </header>

        <ul class="part-search-list">
          <li v-for="hit in group.hits" :key="hit.part.id">
            <button type="button" class="part-search-row" @click="openPart(group.model, hit.part)">
              <span class="part-search-row__code" :style="{ backgroundColor: hit.part.color }">{{ hit.part.code }}</span>
              <span class="part-search-row__body">
                <strong v-html="highlight(hit.part.name)"></strong>
                <em class="part-search-row__chips">
                  <i v-for="field in hit.matchedFields" :key="field">{{ field }}</i>
                </em>
                <span class="part-search-row__detail part-search-row__detail--material" v-html="`材质 · ${highlight(hit.part.material)}`"></span>
                <span class="part-search-row__detail part-search-row__detail--fault" v-html="`常见故障 · ${highlight(hit.part.faults)}`"></span>
              </span>
              <span class="part-search-row__go">定位 <b>→</b></span>
            </button>
          </li>
        </ul>
      </section>
    </template>
  </main>
</template>
