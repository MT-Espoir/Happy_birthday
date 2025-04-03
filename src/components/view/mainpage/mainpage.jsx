import React, { useState, useEffect, useRef } from 'react';
import './mainpage.css';
// Bạn cần thêm các file âm thanh và hình ảnh vào thư mục assets
import giftpop from '../../assests/sounds/opengift.mp3';
import framepop from '../../assests/sounds/framepop.mp3'; // Âm thanh cho khung ảnh
import cakeImage from '../../assests/images/cake/birthdaycake.png'; 
import person1 from '../../assests/images/persons/person1.jpg'; 
import person2 from '../../assests/images/persons/person2.jpg'; 
import person3 from '../../assests/images/persons/person3.jpg'; 
import person4 from '../../assests/images/persons/person4.jpg'; 
import person5 from '../../assests/images/persons/person5.jpg'; 
import gift1 from '../../assests/images/giftbox/gift1.png'; 
import gift2 from '../../assests/images/giftbox/gift2.png'; 
import giftFly1 from '../../assests/images/giftbox/gift-fly1.png'; 
import giftFly2 from '../../assests/images/giftbox/gift-fly2.png'; 

const MainPage = ({ bgAudio }) => {
  const [cakeClicked, setCakeClicked] = useState(false);
  const [showWishes, setShowWishes] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [visibleFrames, setVisibleFrames] = useState([]);
  const [frameOrder, setFrameOrder] = useState([]);
  const [showExitMessage, setShowExitMessage] = useState(false);
  const [hoveredFrame, setHoveredFrame] = useState(null);

  const giftpopRef = useRef(new Audio(giftpop));
  const framepopRef = useRef(new Audio(framepop));
  
  useEffect(() => {
    const frames = [0, 1, 2, 3, 4];
    const shuffledFrames = [...frames].sort(() => Math.random() - 0.5);
    setFrameOrder(shuffledFrames);
      setTimeout(() => {
      setPageVisible(true);
    }, 100);
    giftpopRef.current.volume = 0.7;
    framepopRef.current.volume = 0.6;

    const handleOrientationChange = () => {
      setPageVisible(false);
      setTimeout(() => {
        setPageVisible(true);
      }, 50);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Cleanup function
    return () => {
      if (giftpopRef.current) {
        giftpopRef.current.pause();
        giftpopRef.current.currentTime = 0;
      }
      if (framepopRef.current) {
        framepopRef.current.pause();
        framepopRef.current.currentTime = 0;
      }
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
  const getMessageForFrame = (frameIndex) => {
    switch(frameIndex) {
      case 0: return "Mong bà trong mắt có ánh sáng, trong lòng có tình yêu, đoạn đường sau này xuân ấm hoa nở!";
      case 1: return "Bất kể có đi đến đâu, dẫu thời tiết có ra sao, hãy luôn mang theo ánh nắng của chính mình nhé!";
      case 2: return "Ngày tháng sau này còn rất dài, chỉ mong đoạn đường sau này, bốn mùa đều là mùa đẹp nhất!";
      case 3: return "Một ngày ba bữa, vui vẻ thanh thơi, ngày mưa nhớ mang ô, khi nắng có bóng mát dịu dàng!";
      case 4: return "Phải đối xử tốt với chính mình nhé người đẹp!";
      default: return "ALL BEST WISHES FOR YOU";
    }
  };

  const handleCakeClick = () => {
    setCakeClicked(true);
    giftpopRef.current.play()
      .catch(error => console.error("Không thể phát âm thanh:", error));
    if (bgAudio) {
      const originalVolume = bgAudio.volume;     
      bgAudio.volume = 0.3;     
      setTimeout(() => {
        bgAudio.volume = originalVolume;
      }, giftpopRef.current.duration * 1000 || 2000); 
    }
    
    setTimeout(() => {
      setShowWishes(true);
      frameOrder.forEach((frameIndex, index) => {
        setTimeout(() => {
          const playFrameSound = () => {
            const frameSound = framepopRef.current.cloneNode();
            frameSound.volume = 0.6;
            frameSound.play().catch(error => console.error("Không thể phát âm thanh khung ảnh:", error));
          };
          playFrameSound();
          setVisibleFrames(prev => [...prev, frameIndex]);
        }, 800 * (index + 1)); // Mỗi khung cách nhau 800ms
      });
      setTimeout(() => {
        setShowExitMessage(true);
      }, 15000);
    }, 1000);
  };

  const isFrameVisible = (frameIndex) => {
    return visibleFrames.includes(frameIndex);
  };

  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  return (
    <div className={`birthday-container ${pageVisible ? 'visible' : ''}`}>
      {showExitMessage && (
        <div className="exit-message">
        
        </div>
      )}
      
      <div className="decorations">
        <div className="balloons">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="flowers">
          <span></span>
          <span></span>
        </div>
        <div className="stars">
          <span></span>
          <span></span>
        </div>
        <div className="hearts">
          <span></span>
          <span></span>
        </div>
        <div className="gifts">
          <span></span>
          <span></span>
        </div>
      </div>
      
      {/* Quà tặng ở góc màn hình */}
      <div className="corner-gifts">
        <div className="gift-left">
          <img src={gift2} alt="Quà tặng" />
        </div>
        <div className="gift-right">
          <img src={gift1} alt="Quà tặng" />
        </div>
      </div>
      
      {/* Ribbons, trái tim và ngôi sao rơi trên toàn màn hình */}
      {cakeClicked && (
        <div className="falling-decorations-fullscreen">
          <div className="falling-ribbons">
            {[...Array(isMobileDevice() ? 15 : 30)].map((_, i) => (
              <div key={`ribbon-${i}`} className="falling-ribbon" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}></div>
            ))}
          </div>
          
          {/* Trái tim */}
          <div className="falling-hearts">
            {[...Array(isMobileDevice() ? 10 : 20)].map((_, i) => (
              <div key={`heart-${i}`} className="falling-heart" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`
              }}></div>
            ))}
          </div>
          
          {/* Ngôi sao  */}
          <div className="falling-stars">
            {[...Array(isMobileDevice() ? 10 : 20)].map((_, i) => (
              <div key={`star-${i}`} className="falling-star" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
          
          {/* Hộp quà*/}
          <div className="falling-gifts">
            {[...Array(isMobileDevice() ? 8 : 15)].map((_, i) => (
              <div 
                key={`gift-${i}`} 
                className="falling-gift" 
                style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${7 + Math.random() * 4}s` // Thêm thời gian khác nhau
                }}
              >
                <img src={i % 2 === 0 ? giftFly1 : giftFly2} alt="Quà rơi" />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Cake */}
      <div className={`cake-container ${cakeClicked ? 'active' : ''}`} onClick={!cakeClicked ? handleCakeClick : undefined}>
        <div className="cake-image">
          <img src={cakeImage} alt="Bánh sinh nhật" />
        </div>
        
        {/* Pháo giấy */}
        {cakeClicked && (
          <div className="confetti-container">
            <div className="confetti left-top"></div>
            <div className="confetti left-bottom"></div>
            <div className="confetti right-top"></div>
            <div className="confetti right-bottom"></div>
          </div>
        )}
      </div>
      
      {/* Lời chúc sinh nhật */}
      <div className="message-container">
        {!showWishes ? 
          <p className="initial-message">CLICK BÁNH KEM I!!!</p> :
          <div className="birthday-wish">
            <h1 className={hoveredFrame !== null ? 'message-changing' : ''}>
              {hoveredFrame !== null ? getMessageForFrame(hoveredFrame) : "ALL BEST WISHES FOR YOU"}
            </h1>
          </div>
        }
      </div>
      
      {showWishes && (
        <div className="photo-frames">
          <div className="left-photos">
            {/* Khung ảnh 1 */}
            <div 
              className={`photo-frame birthday-person frame-random-1 ${isFrameVisible(0) ? 'visible' : ''}`}
              onMouseEnter={() => setHoveredFrame(0)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              <img src={person1} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 2 */}
            <div 
              className={`photo-frame birthday-person frame-random-2 ${isFrameVisible(1) ? 'visible' : ''}`}
              onMouseEnter={() => setHoveredFrame(1)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              <img src={person2} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 3 */}
            <div 
              className={`photo-frame birthday-person frame-random-3 ${isFrameVisible(2) ? 'visible' : ''}`}
              onMouseEnter={() => setHoveredFrame(2)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              <img src={person3} alt="Người sinh nhật" />
            </div>
          </div>
          <div className="right-photos">
            {/* Khung ảnh 4 */}
            <div 
              className={`photo-frame birthday-person frame-random-4 ${isFrameVisible(3) ? 'visible' : ''}`}
              onMouseEnter={() => setHoveredFrame(3)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              <img src={person4} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 5 */}
            <div 
              className={`photo-frame birthday-person frame-random-5 ${isFrameVisible(4) ? 'visible' : ''}`}
              onMouseEnter={() => setHoveredFrame(4)}
              onMouseLeave={() => setHoveredFrame(null)}
            >
              <img src={person5} alt="Người sinh nhật" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;