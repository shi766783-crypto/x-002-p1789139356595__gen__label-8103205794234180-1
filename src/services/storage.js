const STORAGE_KEYS = {
  customDevices: 'workshop.custom-devices',
  activity: 'workshop.activity',
  favorites: 'workshop.favorites',
}

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getCustomDevices() {
  return read(STORAGE_KEYS.customDevices, [])
}

export function saveCustomDevice(device) {
  const devices = getCustomDevices()
  write(STORAGE_KEYS.customDevices, [device, ...devices])
  return device
}

export function getActivity() {
  return read(STORAGE_KEYS.activity, { views: {}, history: [] })
}

export function recordDeviceView(deviceId) {
  const activity = getActivity()
  activity.views[deviceId] = (activity.views[deviceId] || 0) + 1
  activity.history = [
    { deviceId, viewedAt: new Date().toISOString() },
    ...activity.history.filter((item) => item.deviceId !== deviceId),
  ].slice(0, 12)
  write(STORAGE_KEYS.activity, activity)
  return activity
}

export function getFavorites() {
  return read(STORAGE_KEYS.favorites, [])
}

export function toggleFavorite(deviceId) {
  const favorites = getFavorites()
  const next = favorites.includes(deviceId)
    ? favorites.filter((id) => id !== deviceId)
    : [deviceId, ...favorites]
  write(STORAGE_KEYS.favorites, next)
  return next
}

export function clearLocalData() {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
}
