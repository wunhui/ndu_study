import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

export default function useKakaoLoader() {
  useKakaoLoaderOrigin({
    appkey: "9f9440e434fbb97ab91509d6fa7fb5ba",
    libraries: ["clusterer", "drawing", "services"],
  })
}