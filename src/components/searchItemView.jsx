import useMainStore from '@store/useMainStore';
import { useEffect } from 'react';
import { IconShare } from './icons/IconShare';
import { IconStar } from './icons/IconStar';
import { IconClose } from './icons/IconClose';
export const SearchItemView = ({data}) => {
	const { setListViewPopup, saveListData, setSaveListData, removeSaveListData } = useMainStore()
// 2024.10.17 저장 버튼 클릭 시 acitve 값에 따른 데이터 저장 및 삭제
	const handleClickSave = () => {
		data.active = !data.active;
		if (data.active) {
			setSaveListData(data);
		} else {
			removeSaveListData(data.place_name);
		}
        console.log(saveListData)
	};
	
	useEffect(() => {
		console.log(saveListData)
	}, [saveListData]);
	
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
					<p>
						<b>{data.place_name}</b>
						<span>{data.category_group_name}</span>
					</p>
				</div>
            </div>
			<div className="content">
				<ul className='btn_wrap'>
					<li className='btn_list'>
						<button type="button" onClick={handleClickSave}>
							<div className="icon_box">
								<IconStar isActive={
									data.active
								} />
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
