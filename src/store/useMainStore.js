import { create } from 'zustand';


const useMainStore = create((set) => ({
    map: '', // 맵 셋팅
    markers: [], // 마커
    level: 3, // 확대/축소
    searchValue: '', // 검색 인풋값
    searchKeyword: '', // 검색 키워드
    searchList: [], // 검색 리스트
    center: { // 맵 좌표값
        lat: 37.56534539636417, 
        lng: 126.97719821079865
    },
    coordinates: { // 클릭 시 좌표값
        x: null,
        y: null
    },
    keywordCoordinates: null, // 클릭 시 키워드 검색
    listViewPopup: false, // 상세보기
    listViewData: {}, // 상세보기 시 데이터 값
    currentLocation: { // 현재 위치값
        lat: null,
        lng: null
    },
    // 2024.10.17 저장 기능 추가
    saveListData: [], // 저장 시 데이터값
    setMap: (value) => set({ map: value }),
    setMarkers: (value) => set({ markers: value }),
    setLevel: (value) => set({ level: value}),
    setSearchValue: (value) => set({ searchValue: value }),
    setSearchKeyword: (value) => set({ searchKeyword: value }),
    setSearchList: (value) => set({ searchList: value }),
    setCenter: (value) => set({ center: value }),
    setCoordinates: (value) => set({ coordinates: value }),
    setKeywordCoordinates: (value) => set({ keywordCoordinates: value }),
    setListViewPopup: (value) => set({ listViewPopup: value }),
    setListViewData: (value) => set({ listViewData: value }),
    setCurrentLocation: (value) => set({ currentLocation: value }),
    // 2024.10.17 저장 기능 추가
    setSaveListData: (value) => set((state) => ({ // 저장 기능
        saveListData: [...state.saveListData, value] 
    })),
    removeSaveListData: ((value) => set((state) => ({ // 삭제 기능
        saveListData: state.saveListData.filter((item => item.place_name !== value))
    })))
}))

export default useMainStore;