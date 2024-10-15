import { create } from 'zustand';


const useMainStore = create((set) => ({
    map: '',
    markers: [],
    level: 3,
    searchValue: '',
    searchKeyword: '',
    searchList: [],
    center: {
        lat: 37.56534539636417, 
        lng: 126.97719821079865
    },
    // 2024.10.15 좌표 키워드 스토어 설정
    coordinates: {
        x: null,
        y: null
    },
    keywordCoordinates: null,
    listViewPopup: false,
    listViewData: false,
    setMap: (value) => set({ map: value }),
    setMarkers: (value) => set({ markers: value }),
    setLevel: (value) => set({ level: value}),
    setSearchValue: (value) => set({ searchValue: value }),
    setSearchKeyword: (value) => set({ searchKeyword: value }),
    setSearchList: (value) => set({ searchList: value }),
    setCenter: (value) => set({ center: value }),
    // 2024.10.15 좌표 키워드 스토어 설정
    setCoordinates: (value) => set({ coordinates: value }),
    setKeywordCoordinates: (value) => set({ keywordCoordinates: value }),
    setListViewPopup: (value) => set({ listViewPopup: value }),
    setListViewData: (value) => set({ listViewData: value })
}))

export default useMainStore;