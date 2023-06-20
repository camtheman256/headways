import { useEffect, useState } from "react"

export default function NearMe() {
  const [location, setLocation] = useState<GeolocationPosition>()

  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition((p) => setLocation(p))
  }, [])

  if(!location) return <LocationError />

  return <></>
}

const LocationError = () => <div>
  <h1>Please enable your location.</h1>
  <p>Headways uses your location to find stops near you.</p>
</div>