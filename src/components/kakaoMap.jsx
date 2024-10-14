import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";
import useMainStore from "../store/useMainStore";
import { fetchCoordinate, fetchKeyword } from '../api/fetchPlaces'
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

const KakaoMap = () => {
    /* eslint-disable */
    const {
      searchList,
      map,
      setMap,
      markers,
      setMarkers,
      center,
      setCenter,
      level,
      setLevel,
      coordinateData,
      setCoordinateData
    } = useMainStore()
    
    // 2024.10.14 시작 _ data에 담아두고 싶음
    const { data } = useQuery({
        queryKey: ['fetchCoordinate'],
        queryFn: () => fetchCoordinate(),
        enabled: false,
    })
    // 2024.10.14 끝

    // region 검색결과 마커 생성
    useEffect(() => {
        if (searchList && searchList.length > 0) {
            console.log(searchList)
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
            console.log(markers)
            map.setBounds(bounds); // 검색된 결과의 범위로 지도 중심 및 범위 설정
        }
    }, [searchList])

    // region 지도 클릭 시 마커 생성 _ 2024.10.14 _ 시작
    let customOverlay = new window.kakao.maps.CustomOverlay({ // 하나만 생성
        clickable: true,
        zIndex: 1,
    });

    const handleMapClick = useCallback(async (event) => {
        const lat = event.latLng.getLat();
        const lng = event.latLng.getLng();
    
        // 여기서 response로 불러오지 말고 query 쪽 data로 불러오고 싶음
        let response = await fetchCoordinate({ x: lng, y: lat });
        setCoordinateData(response[0])
        if (response && response.length > 0) {
            const address = response[0].address.address_name; 
            const buildingName = response[0].road_address?.building_name; 
            customOverlay.setContent(`
                <div class="info_wrap">
                    <div class="info_title">
                        ${buildingName ? buildingName : address}
                    </div>
                    <div class="btn_wrap">
                        <button type="button">링크로 이동</button>
                    </div>
                </div>
            `);
            customOverlay.setPosition(new window.kakao.maps.LatLng(lat, lng)); // 위치 업데이트
            customOverlay.setMap(map);
        }
    }, [map]);

    useEffect(() => {
        if (map) {
            // 클릭 이벤트 리스너 추가
            kakao.maps.event.addListener(map, 'click', handleMapClick);
            // 컴포넌트 언마운트 시 리스너 제거
            return () => {
                kakao.maps.event.removeListener(map, 'click', handleMapClick);
            };
        }
    }, [map, markers]);
    // 2024.10.14 _ 끝

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
            >
                <MapTypeControl position={"TOPRIGHT"} />
                <ZoomControl position={"RIGHT"} />
            </Map>
        </div>
    )
}

export default KakaoMap