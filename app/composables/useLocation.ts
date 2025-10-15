const access = ref(false)
const latitude = ref<number | null>(null)
const longitude = ref<number | null>(null)
const elevation = ref<number | null>(null)

export default function () {
  const requestAccess = async () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by your browser');
      access.value = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude.value = position.coords.latitude;
        longitude.value = position.coords.longitude;
        elevation.value = position.coords.altitude; // May be null if not available
        access.value = true;
      },
      (error) => {
        console.error('Error obtaining location:', error);
        access.value = false;
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };
  
  return {
    access,
    latitude,
    longitude,
    elevation,
    requestAccess
  };
}