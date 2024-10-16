import { Map, MapTypeControl, ZoomControl, Circle } from "react-kakao-maps-sdk";
import useMainStore from "../store/useMainStore";
import { fetchCoordinate, fetchKeyword } from '../api/fetchPlaces'
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {useGeolocation} from "../hook/useGeoLocation";


const KakaoMap = () => {
    /* eslint-disable */
    const {
      searchList,         // 검색결과 store
      map,                // 카카오맵 초기 설정 store
      setMap,
      setMarkers,
      center,             // 좌표 중심 설정 store
      setCenter,
      level,              // 확대축소 설정 store
      setLevel,
      coordinates,        // 좌표 검색 store
      setCoordinates,
      keywordCoordinates, // 키워드 검색 store
      setKeywordCoordinates,
      // 2024.10.16 현재 위치 설정 추후 사용 예정
      currentLocation,
      setCurrentLocation
    } = useMainStore()

    // 좌표 데이터 api query
    const { data, refetch } = useQuery({
        queryKey: ['coordinateAddress', coordinates],
        queryFn: () => fetchCoordinate(coordinates), 
        enabled: coordinates.x !== null && coordinates.y !== null, 
    });

    // 키워드 검색 데이터 api query
    const { data: keywordData, refetch: keywordRefetch } = useQuery({
        queryKey: ['fetchKeyword', keywordCoordinates, coordinates.x, coordinates.y],
        queryFn: () => fetchKeyword({
            term: keywordCoordinates,
            x: coordinates.x,
            y: coordinates.y,
        }),
        enabled: keywordCoordinates !== null && coordinates.x !== null && coordinates.y !== null,
    });
    // 검색결과 마커 생성
    useEffect(() => {
        if (searchList && searchList.length > 0) {
            const bounds = new kakao.maps.LatLngBounds();
            const markers = [];
            // 검색 결과의 각 장소에 대해 마커 생성
            searchList.forEach((item) => {
                const boundPosition = new kakao.maps.LatLng(searchList[0].y, searchList[0].x); // 장소 좌표 (위도, 경도)
                const markerPosition = new kakao.maps.LatLng(item.y, item.x); // 장소 좌표 (위도, 경도)
                const marker = new kakao.maps.Marker({
                    position: markerPosition,
                });
                setCenter({
                    lat: searchList[0].y,
                    lng: searchList[0].x,
                })
                setLevel(2);
                marker.setMap(map); // 마커를 지도에 표시
                markers.push(marker); // 마커 배열에 추가
                bounds.extend(boundPosition); // 각 마커 좌표로 경계 확장
            });
            setMarkers(markers); // Zustand 상태에 마커 배열 저장
            map.setBounds(bounds); // 검색된 결과의 범위로 지도 중심 및 범위 설정
        }
    }, [searchList])
    
    
    // 클릭 시 useQuery로 위치값 전송 후 data 사용
    // 클릭 시 새로운 좌표로 customOverlay 업데이트
    const customOverlayRef = useRef(null);

    const handleMapClick = (mapData, event) => {
        const x = event.latLng.getLng();
        const y = event.latLng.getLat();
        setCoordinates({ x, y });
        // 기존 오버레이가 있을 경우 제거
        if (customOverlayRef.current) {
            customOverlayRef.current.setMap(null); // 기존 오버레이 제거
            customOverlayRef.current = null; // 오버레이 변수를 null로 초기화
        }
    };


    useEffect(() => {
        if(coordinates.x !== null && coordinates.y !== null) {
            refetch();
        }
    }, [coordinates, refetch]);


    useEffect(() => {
        if(data) {
            if (data.length > 0) {
                const addressName = data[0]?.address?.address_name; 
                if (addressName) {
                    setKeywordCoordinates(addressName);
                    keywordRefetch();
                }
            }
        }
    }, [data, keywordRefetch]);
    useEffect(() => {
        if (keywordData && keywordData.length > 0) {
            const x = coordinates.x;
            const y = coordinates.y;
            const content = `
                <div class="info_wrap">
                    <div class="info_title">
                        ${keywordData[0].place_name}
                    </div>
                    <div class="btn_wrap">
                        <a target="_blank" href="${keywordData[0].place_url}">
                            링크로 이동
                        </a>
                    </div>
                </div>
            `;
            customOverlayRef.current = new window.kakao.maps.CustomOverlay({
                position: new window.kakao.maps.LatLng(y, x),
                content: content,
                clickable: true,
                zIndex: 1
            });
            customOverlayRef.current.setMap(map);
        }

    }, [keywordData, coordinates, map]);


    // 2024.10.16 내 위치 가져오기 _ 가져오기까지 완료 추후 수정 예정
    const { latitude, longitude, accuracy, error } = useGeolocation();
    const [ location, setLocation ] = useState(false)

    const handleLocation = () => {
        setLocation(true)
        if(location) {
            setCenter({
                lat: latitude,
                lng: longitude,
            })
        }
    }
    return (
        <div className="kakao_map_wrapper">
            <Map // 로드뷰를 표시할 Container
                center={{
                    lat: center.lat,
                    lng: center.lng,
                }}
                level={level}
                onCreate={setMap}
                className="kakao_map"
                onClick={(data, event) => handleMapClick(data, event)}
            >
                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
                {/* 2024.10.16 내 위치 가져오기 _ 가져오기까지 완료 추후 수정 예정 */}
                {
                    location &&
                        <Circle
                            center={{
                            lat: latitude,
                            lng: longitude,
                            }}
                            radius={5}
                            strokeWeight={15} // 선의 두께입니다
                            strokeColor={"#ff3e3f"} // 선의 색깔입니다
                            strokeOpacity={.2} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                            strokeStyle={"solid"} // 선의 스타일 입니다
                            fillColor={"#ff3e3f"} // 채우기 색깔입니다
                            fillOpacity={1} // 채우기 불투명도 입니다
                        />
                }
                <button className="location_btn" onClick={handleLocation}>위치</button>
            </Map>
        </div>
    )
}

export default KakaoMap