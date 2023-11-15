const sliderWrapper = document.querySelector('.slider__wrapper');
const AMOUNT_OF_SLIDES = 5;
const SLIDE_WIDTH = 500;
const ANIMATION_TIME = 300;

const slideToLeftButton = document.querySelector('.slider__button_left');
const slideToRightButton = document.querySelector('.slider__button_right');
const pointsWrapper = document.querySelector('.slider__points-wrapper');

let currentSlideIndex = 0;

const slidesHtml = createSlidesHtml(AMOUNT_OF_SLIDES);

sliderWrapper.innerHTML = slidesHtml.slides;
pointsWrapper.innerHTML = slidesHtml.points;

//clone last and first slide and
const firstSlide = document.querySelector('#slide0');
const lastSlide = document.querySelector(`#slide${AMOUNT_OF_SLIDES - 1}`);
const cloneOfFirstSlide = firstSlide.cloneNode(true);
const cloneOfLastSlide = lastSlide.cloneNode(true);
cloneOfLastSlide.classList.add('clone');
cloneOfFirstSlide.classList.add('clone');
sliderWrapper.prepend(cloneOfLastSlide);
sliderWrapper.append(cloneOfFirstSlide);

//set initial position of slide wrapper
sliderWrapper.style.left = `-${SLIDE_WIDTH}px`;

//create html for slides and radio buttons
function createSlidesHtml(amountOfSlides) {
  let slides = '';
  let points = '';
  for (let i = 0; i < amountOfSlides; i++) {
    const imgSource = `https://source.unsplash.com/random?cat,kitten&${i}`;
    slides += `<div class="slider__slide" id="slide${i}" style="width: ${SLIDE_WIDTH}px">
    <img class="slider__image" src="${imgSource}" alt="image of cat">
    <p style="display: block; position: absolute; top: 50%; left: 50%; color: red; font-size: 20px">${
      i + 1
    }</p>
    </div>`;

    points += `<input type="radio" class="slider__point" id="radio${i}" name="point" value="${i}" ${
      i === 0 ? 'checked="true"' : ''
    }}/>`;
  }

  return { slides, points };
}

//universal function for shifting slides
function shiftTo(slideIndex) {
  if (
    sliderWrapper.classList.contains('moving') ||
    slideIndex === currentSlideIndex
  )
    return;
  sliderWrapper.classList.add('moving');

  const destination =
    sliderWrapper.offsetLeft + SLIDE_WIDTH * (currentSlideIndex - slideIndex);
  const animationSpeed =
    (Math.abs(sliderWrapper.offsetLeft) + destination) / ANIMATION_TIME;
  console.log(`destination: ${destination}`);
  console.log(`animation speed: ${animationSpeed}`);

  requestID = requestAnimationFrame((time) =>
    shifting(time, animationSpeed, destination, slideIndex)
  );
}

//initialise variables for animation | MAKE CLOUSURE IN shiftTo
let lastTime;
let destination;
let requestID;
let start;

//animate shifting
function shifting(time, animationSpeed, destination, slideIndex) {
  if (lastTime != null) {
    const delta = time - lastTime;
    sliderWrapper.style.left =
      sliderWrapper.offsetLeft + delta * animationSpeed + 'px';
  } else {
    start = Date.now();
  }

  lastTime = time;
  if (Date.now() - start >= ANIMATION_TIME) {
    lastTime = undefined;
    sliderWrapper.classList.remove('moving');
    currentSlideIndex = slideIndex;

    sliderWrapper.style.left = `${destination}px`;

    if (currentSlideIndex === AMOUNT_OF_SLIDES) {
      sliderWrapper.style.left = -SLIDE_WIDTH + 'px';
      currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
      sliderWrapper.style.left =
        sliderWrapper.offsetLeft - AMOUNT_OF_SLIDES * SLIDE_WIDTH + 'px';
      currentSlideIndex = AMOUNT_OF_SLIDES - 1;
    }

    pointsWrapper[currentSlideIndex].checked = true;
  } else {
    requestID = requestAnimationFrame((time) =>
      shifting(time, animationSpeed, destination, slideIndex)
    );
  }
}

//add listeners for arrow button shifting
slideToLeftButton.addEventListener('click', () =>
  shiftTo(currentSlideIndex - 1)
);
slideToRightButton.addEventListener('click', () =>
  shiftTo(currentSlideIndex + 1)
);

//add listener for radio button shifting
pointsWrapper.addEventListener('change', (event) => {
  shiftTo(+event.target.value);
  event.target.checked = true;
});
