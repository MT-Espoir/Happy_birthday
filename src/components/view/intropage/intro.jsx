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
  
  // Tạo audio ref để quản lý nhạc nền
  const audioRef = useRef(new Audio(bgMusic));
  
  // Phát nhạc khi trang được tải
  // Update the useEffect hook that handles audio

useEffect(() => {
  // Đặt các thuộc tính audio
  audioRef.current.loop = true;
  audioRef.current.volume = 0.7;
  // Cố gắng phát nhạc ngay khi tải trang
  const attemptAutoplay = async () => {
    try {
      // Thử phát nhạc ngay lập tức
      await audioRef.current.play();
      setIsMusicPlaying(true);
    } catch (error) {
      console.log("Autoplay blocked by browser, waiting for user interaction");
      // Fallback - nếu autoplay bị chặn, vẫn lắng nghe sự kiện click
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
  
  // Cố gắng tự động phát
  attemptAutoplay();
  
  // Cleanup khi component unmount
  return () => {
    document.removeEventListener('click', playMusic);
    audioRef.current.pause();
  };
}, [isMusicPlaying]);
  
  // Hàm tạo mảng đám mây ngẫu nhiên
  const generateRandomClouds = () => {
    const cloudImages = [cloud1, cloud2, cloud4];
    const clouds = [];
    
    // Chia màn hình thành nhiều phần để đảm bảo phân bố đều
    const sections = 4; // Chia thành 4x4 phần
    
    // Tạo đám mây phân bố đều trên toàn màn hình
    for (let row = 0; row < sections; row++) {
      for (let col = 0; col < sections; col++) {
        // Mỗi section sẽ có 12-13 đám mây (tổng ~200 đám mây)
        const cloudsPerSection = 6;
        
        for (let i = 0; i < cloudsPerSection; i++) {
          const randomCloudIndex = Math.floor(Math.random() * 3); // Chọn một trong 3 hình ảnh
          
          // Tính toán vị trí trong section
          const topBase = (row * 100) / sections;
          const leftBase = (col * 100) / sections;
          
          // Thêm random offset trong section
          const topOffset = Math.random() * (100 / sections);
          const leftOffset = Math.random() * (100 / sections);
          
          clouds.push({
            id: `${row}-${col}-${i}`,
            image: cloudImages[randomCloudIndex],
            top: topBase + topOffset, // Vị trí top trong section
            left: leftBase + leftOffset, // Vị trí left trong section
            width: 50 + Math.random() * 30, // Giảm kích thước xuống 20-50%
            delay: Math.random() * 1, // Tăng độ trễ ngẫu nhiên (0-2s)
            direction: Math.floor(Math.random() * 4) // Hướng di chuyển ngẫu nhiên (0-3)
          });
        }
      }
    }
    
    return clouds;
  };
  
  // Tạo mảng đám mây khi component được mount
  const [randomClouds] = useState(generateRandomClouds);
  
  // Xử lý khi MainPage đã sẵn sàng
  useEffect(() => {
    if (mainPageReady && showMainPage) {
      // Sau khi MainPage đã được tải và hiển thị, bắt đầu hiệu ứng fade-out
      setTimeout(() => {
        // Bắt đầu hiệu ứng mờ dần của đám mây
        setHideClouds(true);
        setFadeOutIntro(true);
        
        // Đợi cho hiệu ứng fade-out hoàn tất trước khi gỡ bỏ IntroPage
        setTimeout(() => {
          setIntroVisible(false);
        }, 1500);
      }, 1000); // Đợi 1 giây sau khi MainPage đã hiển thị
    }
  }, [mainPageReady, showMainPage]);
  
  const handleLetterClick = () => {
    if (!letterOpened) {
      setLetterOpened(true);
      
      // Đảm bảo nhạc đang phát khi mở thư
      if (!isMusicPlaying) {
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(error => console.error("Không thể phát nhạc:", error));
      }
      
      // Sau khi mở thư, đợi 1.5 giây để người dùng xem nội dung
      setTimeout(() => {
        // Kích hoạt hiệu ứng clouds
        setShowClouds(true);
        
        // Sau 3.5 giây, đám mây đã phủ kín màn hình
        setTimeout(() => {
          setCloudsCoverComplete(true);
          
          // Sau 2 giây giữ đám mây, tải MainPage (nhưng chưa hiệu ứng fade-out)
          setTimeout(() => {
            // Tải MainPage phía dưới các đám mây
            setShowMainPage(true);
            
            // Đánh dấu MainPage đã sẵn sàng sau 500ms để đảm bảo đã render xong
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
      {/* Main Page được render phía dưới (ẩn ban đầu) */}
      {showMainPage && <MainPage bgAudio={audioRef.current} />}
      
      {/* Intro Page nằm phía trên với z-index cao hơn */}
      {introVisible && (
        <div className={`intro-page-container ${fadeOutIntro ? 'fade-out' : ''}`}>
          {/* Hiệu ứng clouds chuyển cảnh */}
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
            
            {/* Bức thư ở giữa */}
            <div 
              className="intro-letter"
              onClick={handleLetterClick}
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
    </div>
  );
};

export default IntroPage;