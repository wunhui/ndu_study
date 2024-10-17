import { Link } from "react-router-dom"
import useMainStore from "../store/useMainStore"

// 2024.10.17 저장 리스트 추가
export const SaveList = ({className}) => {
    const { saveListData, setCenter, setLevel } = useMainStore()

    const handleClick = (item) => {
        console.log(item);
        // 맵 이동
        setCenter({
            lng: item.x, 
            lat: item.y
        });
        // 맵 zoom
        setLevel(1);
    };

    return (
        <div className="save_wrap">
			<div className="save_list">
			    { saveListData && saveListData.length > 0 ?
                    <ul> 
                        {
                            saveListData &&
                            saveListData.map((item, idx) => {
                                return (
                                    <li key={idx} onClick={() => handleClick(item)}>
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
                                    </li>
                                )
                            }) 

                        } 
                    </ul> : 
                    <div className='fetching_text'>저장된 주소가 없습니다.</div>  
			    }
			</div>
        </div>
    )
}