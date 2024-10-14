import { create } from 'zustand';


const useMainStore = create((set) => ({
    map: '',
    markers: [],
    level: 3,
    searchValue: '',
    searchKeyword: '',
    searchList: [],
    searchQuery: {
        page: 1,
        size: 15,
        x: '',
        y: ''
    },
    coordinateData: [],
    center: {
        lat: 37.56534539636417, 
        lng: 126.97719821079865
    },
    setMap: (value) => set({ map: value }),
    setMarkers: (value) => set({ markers: value }),
    setLevel: (value) => set({ level: value}),
    setSearchValue: (value) => set({ searchValue: value }),
    setSearchKeyword: (value) => set({ searchKeyword: value }),
    setSearchList: (value) => set({ searchList: value }),
    setSearchQuery: (value) => set({ searchQuery: value }),
    setCenter: (value) => set({ center: value }),
    setCoordinateData: (value) => set({ coordinateData: value })
}))

export default useMainStore;