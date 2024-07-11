import React from 'react';
import Div1 from './Div1';
import Div2 from './Div2';
import Div3 from './Div3';
import Div4 from './Div4';
import Div5 from './Div5';
import '../../assets/styles.css';

const MainDiv = () => {
  return (
    <div className='MainPageMasterDiv'>
       <Div1 />
       {/* <Div2 /> */}
       <Div3 />
       <Div4 />
       <Div5 />
    </div>
  )
}

export default MainDiv;
