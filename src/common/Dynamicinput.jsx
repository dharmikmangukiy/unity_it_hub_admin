import React, { useEffect, useRef, useState } from 'react'
import './customImageModal.css';

const Dynamicinput = () => {
    const [content, setContent] = useState('');
    const [width, setWidth] = useState(0);
    const span = useRef();

    useEffect(() => {
        setWidth(span.current.offsetWidth + 10);
    }, [content]);

    const changeHandler = evt => {
        setContent(evt.target.value);
    };

    return (
        <wrapper is="custom">
            <span id="hide" ref={span}>{content}</span>
            <input type="text" className='dynamicInputStyle' style={{ width }} autoFocus onChange={changeHandler} />
        </wrapper>
    )
}

export default Dynamicinput