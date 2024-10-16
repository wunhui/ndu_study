
export const IconMenu = ({ fill = null, className = '' }) => {
	return (
		<i className={`svg_wrap icon_menu ${className}`}>
            <svg className="menu" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path className="menu1" d="M 4 6.009 L 20 6.009" stroke={fill ? fill : '#000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(1, 0, 0, 1, 1.7763568394002505e-15, 0)"/>
                <path className="menu2" d="M 4 12 L 20 12" stroke={fill ? fill : '#000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(1, 0, 0, 1, 1.7763568394002505e-15, 0)"/>
                <path className="menu3" d="M 4 17.991 L 20 17.991" stroke={fill ? fill : '#000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="matrix(1, 0, 0, 1, 1.7763568394002505e-15, 0)"/>
            </svg>
		</i>
	);
};