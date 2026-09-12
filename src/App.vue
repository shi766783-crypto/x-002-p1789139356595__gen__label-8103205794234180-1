<script setup>
import { computed, ref } from 'vue'
import CustomBuilder from './components/CustomBuilder.vue'
import DetailView from './components/DetailView.vue'
import LibraryView from './components/LibraryView.vue'
import PartSearchView from './components/PartSearchView.vue'
import ProfileView from './components/ProfileView.vue'
import RankingsView from './components/RankingsView.vue'
import WorkshopNav from './components/WorkshopNav.vue'
import { useWorkshop } from './composables/useWorkshop'

const currentView = ref('library')
const activeModelId = ref('')
const pendingPartId = ref('')
const returnView = ref('library')
const { allModels, customDevices, activity, favorites, openDevice, saveDevice, favoriteDevice } = useWorkshop()

const activeModel = computed(() => allModels.value.find((model) => model.id === activeModelId.value))
const isDetail = computed(() => currentView.value === 'detail' && activeModel.value)

function navigate(view) {
  currentView.value = view
  if (view !== 'detail') {
    activeModelId.value = ''
    pendingPartId.value = ''
  }
}

function openModel(model) {
  returnView.value = currentView.value === 'search' ? 'search' : 'library'
  activeModelId.value = model.id
  pendingPartId.value = ''
  currentView.value = 'detail'
  openDevice(model.id)
}

function openPart(model, partId) {
  returnView.value = 'search'
  activeModelId.value = model.id
  pendingPartId.value = partId
  currentView.value = 'detail'
  openDevice(model.id)
}

function saveModel(model) {
  saveDevice(model)
  openModel(model)
}

function goBack() {
  currentView.value = returnView.value
  activeModelId.value = ''
  pendingPartId.value = ''
}
</script>

<template>
  <div class="app-shell">
    <WorkshopNav v-if="!isDetail" :view="currentView" :custom-count="customDevices.length" @change="navigate" />
    <div v-if="!isDetail" class="page-rule"></div>

    <LibraryView
      v-if="currentView === 'library'"
      :models="allModels"
      :favorites="favorites"
      @open="openModel"
      @favorite="favoriteDevice($event.id)"
      @create="navigate('custom')"
    />
    <PartSearchView v-else-if="currentView === 'search'" :models="allModels" @open="openPart" />
    <CustomBuilder v-else-if="currentView === 'custom'" @back="navigate('library')" @saved="saveModel" />
    <RankingsView v-else-if="currentView === 'rankings'" :models="allModels" :activity="activity" />
    <ProfileView
      v-else-if="currentView === 'profile'"
      :models="allModels"
      :custom-devices="customDevices"
      :activity="activity"
      :favorites="favorites"
      @open="openModel"
      @favorite="favoriteDevice($event.id)"
    />
    <DetailView
      v-else-if="isDetail"
      :key="`${activeModel.id}-${pendingPartId || 'default'}`"
      :model="activeModel"
      :favorite="favorites.includes(activeModel.id)"
      :initial-part-id="pendingPartId"
      :return-label="returnView === 'search' ? '部件检索' : '模型库'"
      @back="goBack"
      @favorite="favoriteDevice(activeModel.id)"
    />
  </div>
</template>
