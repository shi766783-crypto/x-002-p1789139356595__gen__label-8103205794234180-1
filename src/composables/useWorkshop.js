import { computed, ref } from 'vue'
import {
  getActivity,
  getCustomDevices,
  getFavorites,
  recordDeviceView,
  saveCustomDevice,
  toggleFavorite,
} from '../services/storage'
import { presetModels } from '../data/models'

export function useWorkshop() {
  const customDevices = ref(getCustomDevices())
  const activity = ref(getActivity())
  const favorites = ref(getFavorites())

  const allModels = computed(() => [...presetModels, ...customDevices.value])

  function openDevice(deviceId) {
    activity.value = recordDeviceView(deviceId)
  }

  function saveDevice(device) {
    saveCustomDevice(device)
    customDevices.value = getCustomDevices()
  }

  function favoriteDevice(deviceId) {
    favorites.value = toggleFavorite(deviceId)
  }

  return {
    allModels,
    customDevices,
    activity,
    favorites,
    openDevice,
    saveDevice,
    favoriteDevice,
  }
}
