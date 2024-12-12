// ---------------------------------------------
// Hero Text Animation
// ---------------------------------------------

// List of phrases to cycle through
const heroPhrases = [
  "Hello, I'm John Doe.",
  "I build interactive front-end experiences.",
  "I'm passionate about simulation and design.",
  "Welcome to my personal space!"
];

const heroText = document.getElementById('hero-text');
let currentIndex = 0;

/**
 * showNextPhrase:
 * Fades out current text, changes to next phrase, fades it in, and cycles.
 */
function showNextPhrase() {
  heroText.style.opacity = 0;
  setTimeout(() => {
    heroText.textContent = heroPhrases[currentIndex];
    heroText.style.opacity = 1;
    currentIndex = (currentIndex + 1) % heroPhrases.length;
  }, 2000); // Wait for fade out before switching text
}

// Initial call and interval for changing phrases every 6 seconds
showNextPhrase();
setInterval(showNextPhrase, 6000);

// ---------------------------------------------
// Carousel Logic
// ---------------------------------------------
const cardsContainer = document.querySelector(".card-carousel");
const cardsController = document.querySelector(".card-carousel + .card-controller")

/**
 * DraggingEvent class:
 * Handles capturing mouse/touch drag events.
 */
class DraggingEvent {
  constructor(target = undefined) {
    this.target = target;
  }
  
  event(callback) {
    let handler;
    
    this.target.addEventListener("mousedown", e => {
      e.preventDefault()
      handler = callback(e)
      window.addEventListener("mousemove", handler)
      document.addEventListener("mouseleave", clearDraggingEvent)
      window.addEventListener("mouseup", clearDraggingEvent)

      function clearDraggingEvent() {
        window.removeEventListener("mousemove", handler)
        window.removeEventListener("mouseup", clearDraggingEvent)
        document.removeEventListener("mouseleave", clearDraggingEvent)
        handler(null)
      }
    })
    
    this.target.addEventListener("touchstart", e => {
      handler = callback(e)
      window.addEventListener("touchmove", handler)
      window.addEventListener("touchend", clearDraggingEvent)
      document.body.addEventListener("mouseleave", clearDraggingEvent)
      
      function clearDraggingEvent() {
        window.removeEventListener("touchmove", handler)
        window.removeEventListener("touchend", clearDraggingEvent)
        handler(null)
      }
    })
  }
  
  /**
   * getDistance:
   * Calculates and returns the drag distance (x,y) from start to current.
   */
  getDistance(callback) {
    function distanceInit(e1) {
      let startingX, startingY;
      
      if ("touches" in e1) {
        startingX = e1.touches[0].clientX
        startingY = e1.touches[0].clientY
      } else {
        startingX = e1.clientX
        startingY = e1.clientY
      }

      return function(e2) {
        if (e2 === null) {
          return callback(null)
        } else {
          if ("touches" in e2) {
            return callback({
              x: e2.touches[0].clientX - startingX,
              y: e2.touches[0].clientY - startingY
            })
          } else {
            return callback({
              x: e2.clientX - startingX,
              y: e2.clientY - startingY
            })
          }
        }
      }
    }
    
    this.event(distanceInit)
  }
}

/**
 * CardCarousel class:
 * Manages positions, scales, and ordering of cards in a draggable carousel.
 */
class CardCarousel extends DraggingEvent {
  constructor(container, controller = undefined) {
    super(container)
    
    this.container = container
    this.controllerElement = controller
    this.cards = container.querySelectorAll(".card")
    
    // Calculate initial center and card sizing
    this.centerIndex = (this.cards.length - 1) / 2;
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.xScale = {};
    
    // Update layout on resize
    window.addEventListener("resize", this.updateCardWidth.bind(this))
    
    if (this.controllerElement) {
      this.controllerElement.addEventListener("keydown", this.controller.bind(this))      
    }

    // Build initial positions
    this.build()
    // Set up drag event to move cards
    super.getDistance(this.moveCards.bind(this))
  }
  
  updateCardWidth() {
    this.cardWidth = this.cards[0].offsetWidth / this.container.offsetWidth * 100
    this.build()
  }
  
  /**
   * build:
   * Positions cards based on their index relative to the center card.
   */
  build() {
    for (let i = 0; i < this.cards.length; i++) {
      const x = i - this.centerIndex;
      const scale = this.calcScale(x)
      const scale2 = this.calcScale2(x)
      const zIndex = -(Math.abs(i - this.centerIndex))
      const leftPos = this.calcPos(x, scale2)
      
      this.xScale[x] = this.cards[i]
      
      this.updateCards(this.cards[i], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
      })
    }
  }
  
  /**
   * controller:
   * Allows keyboard navigation (left/right arrows) to shift carousel.
   */
  controller(e) {
    const temp = {...this.xScale};
      
    if (e.keyCode === 39) {
      // Right Arrow Key moves carousel to the left
      for (let x in this.xScale) {
        const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;
        temp[newX] = this.xScale[x]
      }
    }
      
    if (e.keyCode == 37) {
      // Left Arrow Key moves carousel to the right
      for (let x in this.xScale) {
        const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;
        temp[newX] = this.xScale[x]
      }
    }
      
    this.xScale = temp;
      
    for (let x in temp) {
      const scale = this.calcScale(x),
            scale2 = this.calcScale2(x),
            leftPos = this.calcPos(x, scale2),
            zIndex = -Math.abs(x)

      this.updateCards(this.xScale[x], {
        x: x,
        scale: scale,
        leftPos: leftPos,
        zIndex: zIndex
      })
    }
  }
  
  /**
   * calcPos:
   * Calculates the horizontal position (as a percentage) for a given card.
   */
  calcPos(x, scale) {
    let formula;
    if (x < 0) {
      formula = (scale * 100 - this.cardWidth) / 2
      return formula
    } else {
      formula = 100 - (scale * 100 + this.cardWidth) / 2
      return formula
    }
  }
  
  /**
   * updateCards:
   * Applies position, scale, zIndex, and highlight classes to cards.
   */
  updateCards(card, data) {
    if (data.x !== undefined) {
      card.setAttribute("data-x", data.x)
    }
    
    if (data.scale !== undefined) {
      card.style.transform = `scale(${data.scale})`
      card.style.opacity = (data.scale === 0) ? 0 : 1;
    }
   
    if (data.leftPos !== undefined) {
      card.style.left = `${data.leftPos}%`        
    }
    
    if (data.zIndex !== undefined) {
      if (data.zIndex === 0) {
        card.classList.add("highlight")
      } else {
        card.classList.remove("highlight")
      }
      card.style.zIndex = data.zIndex  
    }
  }
  
  /**
   * calcScale2:
   * Another scaling function used in position calculations.
   */
  calcScale2(x) {
    if (x <= 0) {
      return 1 - (-1 / 5 * x)
    } else {
      return 1 - (1 / 5 * x)
    }
  }
  
  /**
   * calcScale:
   * Calculates scale based on how far card is from center.
   */
  calcScale(x) {
    const formula = 1 - 1 / 5 * Math.pow(x, 2)
    return (formula <= 0) ? 0 : formula
  }
  
  /**
   * checkOrdering:
   * Ensures proper card ordering when the carousel is dragged.
   */
  checkOrdering(card, x, xDist) {
    const original = parseInt(card.dataset.x)
    const rounded = Math.round(xDist)
    let newX = x
    
    if (x !== x + rounded) {
      if (x + rounded > original) {
        if (x + rounded > this.centerIndex) {
          newX = ((x + rounded - 1) - this.centerIndex) - rounded + -this.centerIndex
        }
      } else if (x + rounded < original) {
        if (x + rounded < -this.centerIndex) {
          newX = ((x + rounded + 1) + this.centerIndex) - rounded + this.centerIndex
        }
      }
      this.xScale[newX + rounded] = card;
    }
    
    const temp = -Math.abs(newX + rounded)
    this.updateCards(card, {zIndex: temp})
    return newX;
  }
  
  /**
   * moveCards:
   * Called on drag, adjusts card positions and scales based on drag distance.
   */
  moveCards(data) {
    let xDist;
    if (data != null) {
      this.container.classList.remove("smooth-return")
      xDist = data.x / 250; // Adjust sensitivity as needed
    } else {
      this.container.classList.add("smooth-return")
      xDist = 0;
      for (let x in this.xScale) {
        this.updateCards(this.xScale[x], {
          x: x,
          zIndex: Math.abs(Math.abs(x) - this.centerIndex)
        })
      }
    }

    for (let i = 0; i < this.cards.length; i++) {
      const x = this.checkOrdering(this.cards[i], parseInt(this.cards[i].dataset.x), xDist),
            scale = this.calcScale(x + xDist),
            scale2 = this.calcScale2(x + xDist),
            leftPos = this.calcPos(x + xDist, scale2)
      
      this.updateCards(this.cards[i], {
        scale: scale,
        leftPos: leftPos
      })
    }
  }
}

// Instantiate the carousel
const carousel = new CardCarousel(cardsContainer);
