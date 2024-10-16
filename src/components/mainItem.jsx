import { Link } from 'react-router-dom';
import {CustomInput} from './form';
import { IconShare } from './icons/IconShare';
import { IconStar } from './icons/IconStar';
import useMainStore from '@store/useMainStore';
import { IconClose } from './icons/IconClose';
import { useEffect, useState } from 'react';
import { fetchSearch } from '../api/fetchPlaces'
import { useQuery } from '@tanstack/react-query';
import { IconMenu } from './icons/IconMenu';

export const LeftWrapper = () => {
	const [active, setActive] = useState(null)
	return (
		<div className="wrapper_left">
			<div className="mb_menu">
				<button type="button" onClick={() => setActive(prev => !prev)}>
					<IconMenu className={
						
						active ? 'active' : ''} />
				</button>
			</div>
			<SearchForm className={active ? 'active' : ''} />
        </div>
	);
};

export const SearchForm = ({className}) => {
	const {
		setCenter,
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
			setSearchList(data); 
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
	}

	return (
		<div className={`search_form ${className}`}>
			<div className="top">
				<CustomInput 
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)} 
				/>
				<button type="button" className='btn_search' onClick={handleSearch}>검색</button>
			</div>
			<div className="content">
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
												<p>도로명 : {item.address_name}</p>
												<p>지번 : {item.road_address_name}</p>
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



export const SearchItemView = ({data}) => {
	const [pushData, setPushData] = useState(
		{
			place_name: data.place_name,
			category_group_name: data.category_group_name,
			active: false,
			lat: data.lat,
			lng: data.lng
		}
	);
	const { setListViewPopup, saveListData, setSaveListData } = useMainStore()
	const handleClickSave = () => {
		console.log(data)
		setPushData(prev => {
			const updatedData = { ...prev, active: !prev.active };
			return updatedData; 
		});
		console.log(pushData)
	}

    useEffect(() => {
        if (data) {
			setPushData(prev => ({
                place_name: data.place_name,
                category_group_name: data.category_group_name,
				lat: data.y,
				lng: data.x,
                active: prev.data
            }));
        }
    }, [data]);

	const handleClickShare = () => {
        // share to social media
    }
	return (
        <div className='search_item_view'>
            <div className='top'>
				<div className="img_wrap">
					img none
					<button className='btn_close' type='button' onClick={() => {setListViewPopup(false)}}>
						<IconClose />
					</button>
				</div>
				<div className='title_wrap'>
					<p><b>{pushData.place_name}</b><span>{pushData.category_group_name}</span></p>
				</div>
            </div>
			<div className="content">
				<ul className='btn_wrap'>
					<li className='btn_list'>
						<button type="button" onClick={handleClickSave}>
							<div className="icon_box">
								<IconStar isActive={pushData.active} />
							</div>
							<div className="text">저장</div>
						</button>
					</li>
					
					<li className='btn_list'>
						<button type="button" onClick={handleClickShare}>
							<div className="icon_box">
								<IconShare />
							</div>
							<div className="text">공유</div>
						</button>
					</li>
				</ul>
				<div className='blank'/>
			</div>
		</div>
	)
}


