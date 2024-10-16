import { useState, useEffect } from "react";
// 2024.10.16 내 위치 가져오기 훅 작성
export const useGeolocation = () => {
  // api 기능 완료시 추후 수정 예정
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prevState) => ({
        ...prevState,
        error: "위치 가져오기 실패",
      }));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (pos) => {
      const crd = pos.coords;
      setLocation({
        latitude: crd.latitude,
        longitude: crd.longitude,
        accuracy: crd.accuracy,
        error: null,
      });
    };

    const error = (err) => {
      setLocation((prevState) => ({
        ...prevState,
        error: `ERROR(${err.code}): ${err.message}`,
      }));
    };

    const watcher = navigator.geolocation.getCurrentPosition(success, error, options);

    return () => {
      if (watcher) {
        navigator.geolocation.clearWatch(watcher);
      }
    };
  }, []);

  return location;
};