'use client';

import React, { useState, useEffect } from 'react';
import GreyButton from '@/components/keyword/greyButton/GreyButton';
import { useRouter } from "next/navigation";
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { v4 as uuidv4 } from 'uuid';
import FormModal from "@/components/keyword/FormModal/FormModal";
import HostRoomModal from "@/components/keyword/HostRoomModal/HostRoomModal";
import Rules from "@/components/keyword/rules/Rules";

export default function Home() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>(undefined);
  const [roomCodeToCheck, setRoomCodeToCheck] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Set mouse position
  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Trigger room existence check only if roomCodeToCheck is set

  // Generate room code
  function generateRoomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomCode = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters[randomIndex];
    }
    return roomCode;
  }
  const howToPlayContent = `
  EVERY PLAYER WILL BE GIVEN A KEYWORD, THEY ARE A [red]SCIENTIST[/red]. HOWEVER, ONE OF THE PLAYERS WILL NOT BE GIVEN A WORD. THEY ARE THE [red]CYBORG[/red].

  THE [red]CYBORG'S[/red] GOAL IS TO FIND OUT WHAT THE WORD IS AND TRY TO FIT IN.
  THE [red]SCIENTISTS'[/red] GOAL IS TO FIGURE OUT WHO THE [red]CYBORG[/red] IS.

  THE PLAYERS WILL GO AROUND CLOCKWISE AND SAY A WORD RELATING TO THE KEYWORD. FOR EXAMPLE, IF THE WORD WAS "[green]LEBRON JAMES[/green]", YOU WOULD SAY "[green]BASKETBALL[/green]".

  CONTINUE UNTIL THE TIMER RUNS OUT OR IF THE PLAYERS ARE READY TO VOTE FOR THE [red]CYBORG[/red].
  `;

  const handleShowRules = () => {
    setShowRules(true);
  };
  const handleHideRules = () => {
    setShowRules(false);
  };

  const hostGame = (name: string) => {    
    const userId = uuidv4(); // Generate a unique user ID
    // get username from modal
    localStorage.setItem('username', name);
    localStorage.setItem('userId', userId);
    localStorage.setItem('isHost', 'true');

    const newCode = generateRoomCode();

    router.push(`/keyword/gameroom?roomCode=${newCode}`);
  };

  const handleJoin = (roomCode: string, name: string) => {
    const userId = uuidv4(); // Generate a unique user ID
    setRoomCodeToCheck(roomCode);
    setName(name);
    localStorage.setItem('isHost', "false");
    localStorage.setItem('username', name);
    localStorage.setItem('userId', userId);

  }

  useEffect(() => {
    if (roomCodeToCheck && name) {
      const userId = uuidv4(); // Generate a unique user ID
      socket?.emit("join-room", roomCodeToCheck, name, userId, (response: any) => {
        if (response.error) {
          alert(response.error);
        } else {
          router.push(`/keyword/gameroom?roomCode=${roomCodeToCheck}`);
        }
      });
    } else if (roomCodeToCheck) {
      console.log("Room does not exist.");
    }
  }, [roomCodeToCheck, name, router]);

  useEffect(() => {
    const newSocket: Socket<DefaultEventsMap, DefaultEventsMap> = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log(`You connected with socket id: ${newSocket.id}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <>
      <div className="relative h-screen bg-black overflow-hidden"
          onMouseMove={handleMouseMove}
        >
        <div className="absolute inset-0 bg-robot bg-cover"
          style={{
            clipPath: `circle(150px at ${mousePosition.x}px ${mousePosition.y}px)`,
          }}
        >
          {/* Width is fixed to 500 pixels for now */}
          <div className={`contentContainer text-center w-[500px] mx-auto transition-all duration-500 ease-in-out 
            ${showRules ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>

            {/* The original page will be hidden once the 'HOW TO PLAY' button is clicked */}
            {!showRules && (
              <div>
                <div className="titleContainer py-10">
                  <h1 className="welcomeText text-white text-7xl"> WELCOME </h1>
                  <h1 className="toText text-white text-7xl"> TO </h1>
                  <div className="keywordDiv border-4 border-white rounded-3xl p-8 ">
                    <h1 className="keyWordText text-white text-7xl"> KEYWORD </h1>
                  </div>
                </div>
                <div>
                  <HostRoomModal onSubmit={hostGame} />
                  <FormModal onSubmit={handleJoin} />
                </div>
                <div>
                  <GreyButton label="HOW TO PLAY" onClick={handleShowRules} />
                </div>
              </div>
            )}
          </div>

          {/* The game rules are shown once the 'HOW TO PLAY' button is clicked */}
          {showRules && (
            <div className="absolute inset-0 backdrop-blur-sm">
              <div className="rulesContainer fixed bottom-0 left-0 w-full h-[65%] bg-[#0C2820] z-10 border-[10px] border-black
            rounded-tl-3xl rounded-tr-3xl animate-slide-up">
                <Rules title="HOW TO PLAY" content={howToPlayContent} onClose={handleHideRules} />
              </div>
            </div>
          )}
        </div>
      </div>
      
    </>
  );
}