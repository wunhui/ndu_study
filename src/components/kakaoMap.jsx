import { Map, MapMarker, MapTypeControl, ZoomControl, CustomOverlayMap } from "react-kakao-maps-sdk";
import useMainStore from "../store/useMainStore";
import { fetchCoordinate, fetchKeyword } from '../api/fetchPlaces'
import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";


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
      setKeywordCoordinates
    } = useMainStore()

    // 2024.10.15 시작 _ data에 담기 완료
    // 좌표 데이터 api query
    const { data, refetch } = useQuery({
        queryKey: ['coordinateAddress', coordinates],
        queryFn: () => fetchCoordinate(coordinates), 
        enabled: coordinates.x !== null && coordinates.y !== null, 
    });

    // 2024.10.15 시작 _ 키워드 통해 지도 클릭 시 place_name 나오게 변경
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
    // 2024.10.15 끝 
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
    
    
    // 2024.10.15 시작 좌표 키워드로 장소명 받아오기
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
    // 2024.10.15 끝

    // 2024.10.15 시작 좌표갑에 해당하는 오버레이 열고 정보 넣기
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

        // 2024.10.15 끝
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
            </Map>
        </div>
    )
}

export default KakaoMap