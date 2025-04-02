import React, { useState, useEffect, useRef } from 'react';
import './mainpage.css';
// Bạn cần thêm các file âm thanh và hình ảnh vào thư mục assets
// import explosionSound from '../../../assets/sounds/explosion.mp3';
// import bgMusic from '../../../assets/sounds/birthday-music.mp3';
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

const MainPage = () => {
  const [cakeClicked, setCakeClicked] = useState(false);
  const [showWishes, setShowWishes] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  // State mới để theo dõi khung ảnh nào đã xuất hiện
  const [visibleFrames, setVisibleFrames] = useState([]);
  // State để lưu trữ thứ tự xuất hiện ngẫu nhiên của các khung ảnh
  const [frameOrder, setFrameOrder] = useState([]);
  // State để hiển thị thông báo "Nhấn ESC để thoát"
  const [showExitMessage, setShowExitMessage] = useState(false);
  
  const explosionSoundRef = useRef(null);
  const bgMusicRef = useRef(null);
  
  // Tạo thứ tự ngẫu nhiên cho các khung ảnh khi component được tải
  useEffect(() => {
    // Tạo mảng thứ tự khung ảnh từ 0-4
    const frames = [0, 1, 2, 3, 4];
    // Trộn ngẫu nhiên mảng
    const shuffledFrames = [...frames].sort(() => Math.random() - 0.5);
    setFrameOrder(shuffledFrames);
    
    // Thêm hiệu ứng xuất hiện khi trang được load
    setTimeout(() => {
      setPageVisible(true);
    }, 100);
  }, []);
  
  const handleCakeClick = () => {
    setCakeClicked(true);
    
    // Hiển thị lời chúc sau vài giây
    setTimeout(() => {
      setShowWishes(true);
      
      // Hiển thị từng khung ảnh theo thứ tự ngẫu nhiên
      frameOrder.forEach((frameIndex, index) => {
        setTimeout(() => {
          setVisibleFrames(prev => [...prev, frameIndex]);
        }, 800 * (index + 1)); // Mỗi khung cách nhau 800ms
      });
      
      // Hiển thị thông báo "Nhấn ESC để thoát" sau 15 giây
      setTimeout(() => {
        setShowExitMessage(true);
      }, 15000);
    }, 1000);
  };

  // Kiểm tra khung ảnh có nên hiển thị không
  const isFrameVisible = (frameIndex) => {
    return visibleFrames.includes(frameIndex);
  };

  return (
    <div className={`birthday-container ${pageVisible ? 'visible' : ''}`}>
      {/* Phần tử âm thanh */}
      {/* <audio ref={explosionSoundRef} src={explosionSound} />
      <audio ref={bgMusicRef} src={bgMusic} loop /> */}
      
      {/* Thông báo "Nhấn ESC để thoát" */}
      {showExitMessage && (
        <div className="exit-message">
          Nhấn ESC để thoát
        </div>
      )}
      
      {/* Các phần tử trang trí xung quanh */}
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
      
      {/* Phần còn lại của component giữ nguyên */}
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
          {/* Code cho falling decorations giữ nguyên */}
          <div className="falling-ribbons">
            {[...Array(30)].map((_, i) => (
              <div key={`ribbon-${i}`} className="falling-ribbon" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}></div>
            ))}
          </div>
          
          {/* Trái tim rơi từ trên xuống */}
          <div className="falling-hearts">
            {[...Array(20)].map((_, i) => (
              <div key={`heart-${i}`} className="falling-heart" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`
              }}></div>
            ))}
          </div>
          
          {/* Ngôi sao rơi từ trên xuống */}
          <div className="falling-stars">
            {[...Array(20)].map((_, i) => (
              <div key={`star-${i}`} className="falling-star" style={{ 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}></div>
            ))}
          </div>
          
          {/* Hộp quà rơi từ trên xuống với hiệu ứng lắc qua lại */}
          <div className="falling-gifts">
            {[...Array(15)].map((_, i) => (
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
      
      {/* Bánh sinh nhật ở giữa - thay bằng hình ảnh */}
      <div className={`cake-container ${cakeClicked ? 'active' : ''}`} onClick={!cakeClicked ? handleCakeClick : undefined}>
        <div className="cake-image">
          <img src={cakeImage} alt="Bánh sinh nhật" />
        </div>
        
        {/* Pháo giấy bắn khi nhấp vào bánh */}
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
            <h1>ALL BEST WISHES FOR YOU</h1>
          </div>
        }
      </div>
      
      {/* Khung ảnh xuất hiện lần lượt theo thứ tự ngẫu nhiên sau khi nhấp vào bánh */}
      {showWishes && (
        <div className="photo-frames">
          <div className="left-photos">
            {/* Khung ảnh 1 */}
            <div className={`photo-frame birthday-person frame-random-1 ${isFrameVisible(0) ? 'visible' : ''}`}>
              <img src={person1} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 2 */}
            <div className={`photo-frame birthday-person frame-random-2 ${isFrameVisible(1) ? 'visible' : ''}`}>
              <img src={person2} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 3 */}
            <div className={`photo-frame birthday-person frame-random-3 ${isFrameVisible(2) ? 'visible' : ''}`}>
              <img src={person3} alt="Người sinh nhật" />
            </div>
          </div>
          <div className="right-photos">
            {/* Khung ảnh 4 */}
            <div className={`photo-frame birthday-person frame-random-4 ${isFrameVisible(3) ? 'visible' : ''}`}>
              <img src={person4} alt="Người sinh nhật" />
            </div>
            
            {/* Khung ảnh 5 */}
            <div className={`photo-frame birthday-person frame-random-5 ${isFrameVisible(4) ? 'visible' : ''}`}>
              <img src={person5} alt="Người sinh nhật" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainPage;