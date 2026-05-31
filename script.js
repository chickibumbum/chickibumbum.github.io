document.addEventListener('DOMContentLoaded', () => {
    /* ========================================================================
       PRELOADER
       ======================================================================== */
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 1000);
  
    /* ========================================================================
       NAVIGATION & MOBILE MENU
       ======================================================================== */
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.navbar__link');
  
    // Sticky navbar on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      
      // Update aria-expanded
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
    });
  
    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  
    /* ========================================================================
       TU VI FORM SUBMISSION
       ======================================================================== */
    const tuviForm = document.getElementById('tuvi-form');
    const resultSection = document.getElementById('result-section');
    const loadingOverlay = document.getElementById('loading-overlay');
    const resultContent = document.getElementById('result-content');
  
    // Result elements
    const resName = document.getElementById('res-name');
    const resGender = document.getElementById('res-gender');
    const resDob = document.getElementById('res-dob');
    const resTime = document.getElementById('res-time');
  
    if (tuviForm) {
      tuviForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
  
        // Get form values
        const fullName = document.getElementById('fullName').value;
        const genderVal = document.getElementById('gender').value;
        const calType = document.getElementById('calendarType').value;
        const dob = document.getElementById('birthDate').value;
        const timeSelect = document.getElementById('birthTime');
        const timeText = timeSelect.options[timeSelect.selectedIndex].text;
  
        // Update result UI
        resName.textContent = fullName.toUpperCase();
        resGender.textContent = genderVal === 'male' ? 'Nam' : 'Nữ';
        resDob.textContent = `${dob} (${calType === 'solar' ? 'Dương lịch' : 'Âm lịch'})`;
        resTime.textContent = timeText;
  
        // Show result section & loading overlay
        resultSection.classList.remove('hidden');
        resultContent.classList.add('hidden');
        loadingOverlay.style.display = 'flex';
  
        // Scroll to result section
        resultSection.scrollIntoView({ behavior: 'smooth' });
  
        // Simulate calculation delay (2.5 seconds)
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          resultContent.classList.remove('hidden');
          
          // Animate result content appearance
          resultContent.animate([
            { opacity: 0, transform: 'translateY(20px)' },
            { opacity: 1, transform: 'translateY(0)' }
          ], {
            duration: 800,
            easing: 'ease-out',
            fill: 'forwards'
          });
        }, 2500);
      });
    }
  
    /* ========================================================================
       INTERPRETATION TABS (MOCK)
       ======================================================================== */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContent = document.querySelector('.tab-content p');
  
    const mockContent = {
      0: '<strong>Cung Mệnh - Thân:</strong> Có sao Tử Vi, Thiên Phủ tọa thủ, chủ về sự uy quyền, tài lộc dồi dào. Tính cách có phần gia trưởng hoặc muốn dẫn dắt người khác. Mệnh mộc ôn hòa nhưng quật cường.',
      1: '<strong>Đường Công Danh (Quan Lộc):</strong> Hội tụ cát tinh Tả Hữu, Khôi Việt. Bắt đầu sự nghiệp có thể gặp chút thử thách do sát tinh hội chiếu, nhưng từ 30 tuổi trở đi sẽ nắm quyền hành lớn.',
      2: '<strong>Tình Duyên (Phu Thê):</strong> Vợ chồng tâm đầu ý hợp nhưng thỉnh thoảng khắc khẩu do sao Cự Môn chiếu. Kết hôn muộn (sau 28 tuổi) sẽ hạnh phúc bền lâu.'
    };
  
    tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        
        // Update content
        if(tabContent) {
          tabContent.style.opacity = 0;
          setTimeout(() => {
            tabContent.innerHTML = mockContent[index] || mockContent[0];
            tabContent.style.opacity = 1;
          }, 200);
        }
      });
    });
  });
