import { useState } from 'react';
import { IconMenu } from './icons/IconMenu';
import { SearchForm } from './searchForm';
import { SaveList } from './saveList';

export const LeftWrapper = () => {
	const [active, setActive] = useState(null)
	const [memuIndex, setMenuIndex] = useState(0);
	return (
		<div className="wrapper_left">
			<div className="menu_list">
				<h1 className='logo'><span>Wung</span></h1>
				<ul>
					<li><button type="button" onClick={() => setMenuIndex(0)}><span>검색</span></button></li>
					<li><button type="button" onClick={() => setMenuIndex(1)}><span>저장</span></button></li>
				</ul>
			</div>
			<div className="mb_menu">
				<button type="button" onClick={() => setActive(prev => !prev)}>
					<IconMenu className={
						active ? 'active' : ''} />
				</button>
			</div>
			{
				memuIndex === 0 ?
				<SearchForm className={active ? 'active' : ''} /> :
				<SaveList />
			}
        </div>
	);
};


