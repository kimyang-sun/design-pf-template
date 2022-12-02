"use strict";

// 풀페이지 스크롤
$('#fullpage').fullpage({
  autoScrolling: true,
  slidesNavigation: false,
  easing: 'easeInOutCubic',
  easingcss3: 'ease',
  scrollingSpeed: 1000,
  // responsiveWidth: 920,
  // responsiveHeight:900,
  recordHistory: false,
  normalScrollElements: '.filter-list, .layer-wrap',
  onLeave: function(index, nextIndex, direction) {
    let header = $('.header');
    if (index == 1 && direction =='down') { // 1페이지에서 아래로 내려갈때
      header.addClass('dark');
    } else if (index == 2 && direction == 'up') { // 2페이지에서 위로 올라갈때
      header.removeClass('dark');
    }
  },
});

// 아이템 불러오기 & 슬라이드 적용 & 아이템 레이어팝업
let workSlide = $('.work-slide');
let filterButton = $('.filter-list .filter-item button');
let layerPopup = $('.layer-wrap');
let layerPopupImage = layerPopup.find('.layer-inner .layer-img img');
let htmlBody = $('html, body');

function loadItems() {
  return fetch("./data/list.json")
  .then(responsive => responsive.json())
  .then(json => json.items)
  .catch(new Error("데이터 로드를 실패했습니다. 새로고침을 해도 안되면 인터넷 연결상태를 확인해주세요."));
}
function displayItems(items) {
  const itemList = document.querySelector(".work-slide");
  itemList.innerHTML = items.map(item => createHTML(item)).join("");
}
function createHTML(item) {
  return `
  <div class="work-item ${item.filter}">
    <button type="button" data-img="${item.img}">
      <img src="${item.thumnail}" alt="${item.title}">
      <strong class="item-text">${item.title}</strong>
    </button>
  </div>
  `;
}

// Load
loadItems().then(items => {
  displayItems(items);
})
.then(() => {
  workSlide.slick({
    slidesToShow: 3,
    infinite: true,
    draggable: true,
    speed: 300,
    autoplay: false,
    prevArrow: $('.slide-nav .slide-prev'),
    nextArrow: $('.slide-nav .slide-next'),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 451,
        settings: {
          arrows: false,
          centerMode: true,
          centerPadding: '80px',
          slidesToShow: 1,
        }
      },
      {
        breakpoint: 361,
        settings: {
          centerMode: true,
          centerPadding: '50px',
          slidesToShow: 1,
        }
      },
    ]
  });

  // Item Button
  let itemButton = $('.work-slide .work-item button');
  itemButton.on('click', function(){
    openLayerPopup($(this));
  });
  layerPopup.on('click', function(){
    closeLayerPopup();
  });
  layerPopupImage.on('click', function(e){
    e.stopPropagation();
  });
});

// Filter Button
filterButton.on('click', function(){
  let targetButton = $(this);
  let otherButton = targetButton.parent().siblings('.filter-item').find('.filter-button');
  let filter = targetButton.data('filter');

  otherButton.removeClass('active');
  targetButton.addClass('active');

  workSlide.slick('slickUnfilter');
  if (filter == 'all') return;
  workSlide.slick('slickFilter', `.${filter}`);
});

// Layer Popup
function openLayerPopup(target){
  let src = target.attr('data-img');
  let alt = target.find('img').attr('alt');
  layerPopupImage.attr('src', src).attr('alt', alt);
  layerPopup.addClass('active');
};

function closeLayerPopup(){
  layerPopup.removeClass('active');
};

// // 모바일 필터리스트 좌우 스크롤 번짐효과 제어
let filterList = $('.filter-list');
filterList.on('scroll', function(){
  let scrollLeft = $(this).scrollLeft();
	let innerWidth = $(this).innerWidth();
	let totalWidth = $(this).prop('scrollWidth');
	if (scrollLeft + innerWidth >= totalWidth) {
		filterList.addClass("right-end");
	} else {
		filterList.removeClass("right-end");
	}
})