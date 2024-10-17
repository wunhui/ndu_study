import useMainStore from '@store/useMainStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchSearch } from '../api/fetchPlaces'
import { Link } from 'react-router-dom';
import {CustomInput} from './form';
import { SearchItemView } from './searchItemView';

export const SearchForm = ({className}) => {
	const {
		setCenter,
		setLevel,
        searchList,
        setSearchList,
        searchValue,
        setSearchValue,
		listViewPopup,
		setListViewPopup,
		listViewData,
		setListViewData
    } = useMainStore()
	const [inputValue, setInputValue] = useState(''); 
    const { data, refetch, isFetching } = useQuery({
        queryKey: ['fetchSearch', searchValue],
		queryFn: () => fetchSearch({ term: searchValue }), 
		enabled: false,
    });

	// 2024.10.16 검색 결과 값 수정
	const handleSearch = () => {
		if (!inputValue.trim()) {
			alert('키워드를 입력해주세요!');
			return false;
		}
		// 검색 인풋 밸류 setSearchValue에 담아서 밸류값 보내주기
		setSearchValue(inputValue); 
	};
	
	useEffect(() => {
		// 검색 버튼 클릭 이벤트에서 보내준 searchValue로 refetch 실행
		if (searchValue) {
			refetch();  
		}
	}, [searchValue]);
	
	useEffect(() => {
		// refresh 후 스토어에 데이터 저장
		if (data) {
			const updatedData = data.map(item => ({
				...item,
				active: false
			}))
			setSearchList(updatedData); 
			console.log(searchList)
			setLevel(1)
			setCenter({
				lng: data[0]?.x,
				lat: data[0]?.y
			}); 
		}
	}, [data]);
	// 2024.10.16 끝
	
	// 강남역
	const handleListOpen = (item, idx) => {
		setListViewPopup(true)
		setListViewData(searchList[idx])
		setCenter({
			lng: item.x,
			lat: item.y
		})
	}

	return (
		<div className={`search_wrap ${className}`}>
			<div className="search_form">
				<CustomInput 
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)} 
				/>
				<button type="button" className='btn_search' onClick={handleSearch}>검색</button>
			</div>
			<div className="search_list">
			{ searchList && searchList.length > 0 ? 
				(
					<ul className='address_wrap'>
						{
							searchList &&
							searchList.map((item, idx) => {
								return (
									<li key={idx}>
										<button type='button' onClick={() => handleListOpen(item, idx)}>
											<div className='title_wrap'>
												<Link to={item.place_url} target="_blank">
													<b>{item.place_name}</b><span>{item.category_group_name}</span>
												</Link>
											</div>
											<div className="address_list">
												{
													item.address_name &&
													<p>도로명 : {item.address_name}</p>
												}
												{
													item.road_address_name &&
													<p>지번 : {item.road_address_name}</p>

												}
											</div>
										</button>
									</li>
								)
							})
						} 
					</ul> 
				) :
				(
					!isFetching && <div className='fetching_text'>검색 결과가 없습니다.</div> // 검색 결과가 없을 때 메시지 표시
				)
			}
                {
                    listViewPopup &&
                    <SearchItemView data={listViewData} />
                }
			</div>
		</div>
	)
}
