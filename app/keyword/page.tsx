import Image from "next/image";
import React from 'react';
import Redbutton from '@/components/keyword/redButton/RedButton';
import GreyButton from '@/components/keyword/greyButton/GreyButton';


export default function Home() {
  return (
    <>
      <div className="backgroundDiv h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/robotBackground.png)' }}>
        <div className="contentContainer text-center w-[500px] mx-auto">
          <div className="titleContainer py-10">
            <h1 className="welcomeText text-white text-7xl"> WELCOME </h1>
            <h1 className="toText text-white text-7xl"> TO </h1>
            <div className="keywordDiv border-4 border-white rounded-3xl p-8 ">
              <h1 className="keyWordText text-white text-7xl"> KEYWORD </h1>
            </div>
          </div>
          
          <div>
            <Redbutton label={"HOST ROOM"}/>
            <Redbutton label={"JOIN ROOM"}/>
          </div>
          <div>
            <GreyButton label="HOW TO PLAY"/>
          </div>
        </div>
       
        
      </div>
    </>
  );
}
