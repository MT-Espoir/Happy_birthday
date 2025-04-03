import React, { useState, useEffect, useRef } from 'react';
import './intro.css';
import MainPage from '../mainpage/mainpage.jsx';
import letterClose from '../../assests/images/letter/letter-close.png';
import letterOpen from '../../assests/images/letter/letter-open.png';
// Import các hình ảnh mây
import cloud1 from '../../assests/images/clouds/cloud1.png';
import cloud2 from '../../assests/images/clouds/cloud2.png';
import cloud4 from '../../assests/images/clouds/cloud4.png';
// Import âm thanh
import bgMusic from '../../assests/sounds/sound1.mp3';

const IntroPage = () => {
  const [showMainPage, setShowMainPage] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [showClouds, setShowClouds] = useState(false);
  const [hideClouds, setHideClouds] = useState(false);
  const [cloudsCoverComplete, setCloudsCoverComplete] = useState(false);
  const [fadeOutIntro, setFadeOutIntro] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const [mainPageReady, setMainPageReady] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  
  // Tạo audio ref để quản lý nhạc nền
  const audioRef = useRef(new Audio(bgMusic));
  
  // Phát nhạc khi trang được tải
  // Update the useEffect hook that handles audio

useEffect(() => {
  // Check if we're on mobile
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    setShowPlayButton(false);
  }
  
  audioRef.current.loop = true;
  audioRef.current.volume = 0.7;
  const attemptAutoplay = async () => {
    try {
      await audioRef.current.play();
      setIsMusicPlaying(true);
    } catch (error) {
      console.log("Autoplay blocked by browser, waiting for user interaction");
      document.addEventListener('click', playMusic);
    }
  };
  
  // Hàm phát nhạc khi có tương tác người dùng (click)
  const playMusic = () => {
    if (!isMusicPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsMusicPlaying(true);
          document.removeEventListener('click', playMusic);
        })
        .catch(error => console.error("Không thể phát nhạc:", error));
    }
  };
    attemptAutoplay();
    return () => {
    document.removeEventListener('click', playMusic);
    audioRef.current.pause();
  };
}, [isMusicPlaying]);
  
  // Hàm tạo mảng đám mây ngẫu nhiên
  const generateRandomClouds = () => {
    const cloudImages = [cloud1, cloud2, cloud4];
    const clouds = [];
  
    const sections = 4; 
    
    for (let row = 0; row < sections; row++) {
      for (let col = 0; col < sections; col++) {
        const cloudsPerSection = 6;
        
        for (let i = 0; i < cloudsPerSection; i++) {
          const randomCloudIndex = Math.floor(Math.random() * 3); 
          
          const topBase = (row * 100) / sections;
          const leftBase = (col * 100) / sections;
          
          // Thêm random offset trong section
          const topOffset = Math.random() * (100 / sections);
          const leftOffset = Math.random() * (100 / sections);
          
          clouds.push({
            id: `${row}-${col}-${i}`,
            image: cloudImages[randomCloudIndex],
            top: topBase + topOffset, 
            left: leftBase + leftOffset,
            width: 50 + Math.random() * 30, // Giảm kích thước xuống 20-50%
            delay: Math.random() * 1,
            direction: Math.floor(Math.random() * 4) 
          });
        }
      }
    }
    
    return clouds;
  };
  
  // Tạo mảng đám mây khi component được mount
  const [randomClouds] = useState(generateRandomClouds);
  
  useEffect(() => {
    if (mainPageReady && showMainPage) {
      setTimeout(() => {
        setHideClouds(true);
        setFadeOutIntro(true);
        setTimeout(() => {
          setIntroVisible(false);
        }, 1500);
      }, 1000); 
    }
  }, [mainPageReady, showMainPage]);
  
  const handleLetterClick = () => {
    if (!letterOpened) {
      setLetterOpened(true);
      
      if (!isMusicPlaying) {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(error => console.error("Không thể phát nhạc:", error));
      }     
      setTimeout(() => {
        setShowClouds(true);        
        setTimeout(() => {
          setCloudsCoverComplete(true);          
          setTimeout(() => {
            setShowMainPage(true);
            setTimeout(() => {
              setMainPageReady(true);
            }, 500);
          }, 2000);
        }, 3500);
      }, 1500);
    }
  };
  
  return (
    <div className="page-wrapper">
      {showMainPage && <MainPage bgAudio={audioRef.current} />}
      {introVisible && (
        <div className={`intro-page-container ${fadeOutIntro ? 'fade-out' : ''}`}>
          {(showClouds || hideClouds) && (
            <div className={`clouds-transition ${cloudsCoverComplete ? 'complete' : ''} ${hideClouds ? 'fade-out' : ''}`}>
              {randomClouds.map(cloud => (
                <div
                  key={cloud.id}
                  className={`cloud random-cloud direction-${cloud.direction}`}
                  style={{ 
                    backgroundImage: `url(${cloud.image})`,
                    top: `${cloud.top}%`,
                    left: `${cloud.left}%`,
                    width: `${cloud.width}%`,
                    height: `${cloud.width}%`,
                    animationDelay: `${cloud.delay}s`
                  }}
                ></div>
              ))}
            </div>
          )}
          
          <div className="intro-container">
            <div className="intro-background"></div>      
            <div 
              className="intro-letter"
              onClick={handleLetterClick}
              onTouchStart={handleLetterClick}
            >
              <div className={`letter-container ${letterOpened ? 'opened' : ''}`}>
                <img
                  src={letterOpened ? letterOpen : letterClose}
                  alt={letterOpened ? "Lá thư đã mở" : "Lá thư đóng"}
                  className="letter-image"
                />
                {letterOpened && (
                  <div className="letter-content">
                    <p>HAPPY BIRTHDAY</p>
                    <h1> NGƯỜI ĐẸP!</h1>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showPlayButton && !isMusicPlaying && (
        <div className="mobile-play-button" onClick={() => {
          audioRef.current.play()
            .then(() => {
              setIsMusicPlaying(true);
              setShowPlayButton(false);
            })
            .catch(error => console.error("Cannot play audio:", error));
        }}>
        </div>
      )}
    </div>
  );
};

export default IntroPage;