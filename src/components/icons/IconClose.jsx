export const IconClose = ({ fill = null }) => {
	return (
		<i className="svg_wrap">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100"
				height="100"
				viewBox="0 0 100 100"
				fill="none"
			>
				<g fill={fill ? fill : '#000'}>
					<polygon points="99.8 3.8 96 0 50 46.2 4 0 .2 3.8 46.2 50 .2 96.2 4 100 50 53.8 96 100 99.8 96.2 53.8 50 99.8 3.8" />
				</g>
			</svg>
		</i>
	);
};
