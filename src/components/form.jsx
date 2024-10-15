import { forwardRef, useEffect, useRef, useState } from 'react';
import useMainStore from '@store/useMainStore';
import { IconClose } from './icons/IconClose';

export const CustomInput = forwardRef((props, ref) => {
	const {searchValue, setSearchValue} = useMainStore()
	const [isFocus, setFocus] = useState(false);
	const refInput = useRef(null);
	const {
		$className = '',
		$suffix = '',
		$targetKey = ['Enter'],
		$handleKeyUp = () => {},
		$handleKeyDown = () => {},
		$isClear = false,
		$isError = false,
		$isComplate = false,
		$isAutoHeight = true,
		$complateText = '',
		$maxCharacter = false,
		$errorMessage = '',
		$onBlur = () => {}, // 05.24.msy 회원가입 포커스 해제 시 이벤트 필요로 인해 추가
		disabled = false,
		readOnly = false,
		value = '',
		...inputProps
	} = props;
	let addClass = '';
	addClass += isFocus ? ` is_focus` : '';
	addClass += disabled ? ` is_disabled` : '';
	addClass += readOnly ? ` is_readonly` : '';;
	addClass += $className ? ` ${$className}` : '';

	if (inputProps.type === 'number') {
		inputProps.inputMode = 'numeric';
	}

	const onKeyUp = (event) => {
		if (!inputProps.disabled) {
			event.preventDefault();
			event.stopPropagation();
			event.defaultPrevented = true;
			$handleKeyUp(event);
		}
		return false;
	};
	const onKeyDown = (event) => {
		if (!inputProps.disabled) {
			event.preventDefault();
			event.stopPropagation();
			event.defaultPrevented = true;
			$handleKeyDown(event);
		}
		return false;
	};

	const onBlur = () => {
		$onBlur();
		setFocus(false);
	};

	useEffect(() => {
		const targetRef = ref ?? refInput;
		if ($isAutoHeight && targetRef.current) {
			const handleResize = () => {
				targetRef.current.style.height = 'auto';
				targetRef.current.style.height = targetRef.current.scrollHeight + 'px';
			};

			handleResize();
			targetRef?.current?.addEventListener('input', handleResize);
			return () => targetRef?.current?.removeEventListener('input', handleResize);
		}
	}, [$isAutoHeight, ref, refInput]);

	return (
		<label className={`custom_input_wrapper${addClass}`}>
            <input
                ref={ref ?? refInput}
                onKeyUp={(e) => {
                    if ($targetKey === '' || $targetKey.includes(e.key)) {
                        onKeyUp(e);
                    }
                }}
                onKeyDown={(e) => {
                    if ($targetKey === '' || $targetKey.includes(e.key)) {
                        onKeyDown(e);
                    }
                }}
                onFocus={() => setFocus(true)}
                onBlur={() => onBlur}
                disabled={disabled}
                readOnly={readOnly}
                value={value}
                {...inputProps}
            />
			{
				value.length > 0 &&
	            <button type="button" 
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						const empty = { target: { value: '' } };
						inputProps.onChange(empty);
					}}
					className='btn_close'
				>
					<IconClose />
				</button>
			}
		</label>
	);
});