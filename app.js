let controller;
let slideScene;
let pageScene;
let detailScene;

function animateSlides() {
    //Init Controller
    controller = new ScrollMagic.Controller();

    // select elements
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    // loop over each slide
    sliders.forEach((slide, index, slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const slideImg = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        // GSAP
        const slideTimeLine = gsap.timeline({
            defaults: {
                duration: 1,
                ease: 'power2.inOut'
            }
        });

        slideTimeLine.fromTo(revealImg, {
            x: '0%'
        }, {
            x: '100%'
        })

        slideTimeLine.fromTo(slideImg, {
            scale: 2
        }, {
            scale: 1
        }, '-=1'); // animate as soon as the first animation starts

        slideTimeLine.fromTo(revealText, {
            x: '0%'
        }, {
            x: '100%'
        }, '-=0.75');

        // slideTimeLine.fromTo(nav, {
        //     y: '-100%'
        // }, {
        //     y: '0%'
        // }, '-=0.5');

        // Create an animation scene
        slideScene = new ScrollMagic.Scene({
                triggerElement: slide,
                triggerHook: 0.25,
                reverse: false
            })
            .setTween(slideTimeLine)
            .addIndicators({
                colorStart: 'white',
                colorTrigger: 'white',
                name: 'slide'
            })
            .addTo(controller);

        // 2nd Slide Animation
        const pageTimeLine = gsap.timeline();
        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        pageTimeLine.fromTo(nextSlide, {
            y: '0%'
        }, {
            y: '50%'
        });
        pageTimeLine.fromTo(slide, {
            opacity: 1,
            scale: 1
        }, {
            opacity: 0,
            scale: 0.5
        });

        pageTimeLine.fromTo(nextSlide, {
            y: '50%'
        }, {
            y: '0%'
        }, '-=0.5');

        pageScene = new ScrollMagic.Scene({
                triggerElement: slide,
                duration: '100%',
                triggerHook: 0
            }).addIndicators({
                colorStart: 'white',
                colorTrigger: 'white',
                name: 'page',
                indent: 200
            })
            .setPin(slide, {
                pushFollowers: false
            })
            .setTween(pageTimeLine)
            .addTo(controller)
    });
}

const cursor = document.querySelector('.cursor');
const cursorText = cursor.querySelector('span');
const burger = document.querySelector('.burger');

function cursorMove(event) {
    cursor.style.top = event.pageY + 'px';
    cursor.style.left = event.pageX + 'px';
}

function activeCursor(event) {
    const item = event.target;
    if (item.id === 'logo' || item.classList.contains('burger')) {
        cursor.classList.add('nav-active');
    } else {
        cursor.classList.remove('nav-active');
    }
    if (item.classList.contains('explore')) {
        cursor.classList.add('explore-active');
        cursorText.innerText = 'Tap';
        // blend title color with the hidden div color
        gsap.to('.title-swipe', 1, {
            y: '0%'
        });
    } else {
        cursor.classList.remove('explore-active');
        cursorText.innerText = '';
        gsap.to('.title-swipe', 1, {
            y: '100%'
        });
    }
}

function toggleNav(event) {
    // if the target doesn't have active class add it and animate the nav
    if (!event.target.classList.contains('active')) {
        event.target.classList.add('active');
        gsap.to('.line1', 0.5, {
            rotate: '45',
            y: 5,
            background: 'black'
        });
        gsap.to('.line2', 0.5, {
            rotate: '-45',
            y: -5,
            background: 'black'
        });
        gsap.to('#logo', 1, {
            color: 'black'
        });
        // maximize the navbar small circle 
        gsap.to('.nav-bar', 1, {
            clipPath: 'circle(2500px at 100% -10%)'
        });
        document.body.classList.add('hide'); // to disable scroling on reveald navbar
    } else {
        // remove animation
        event.target.classList.remove('active');
        gsap.to('.line1', 0.5, {
            rotate: '0',
            y: 0,
            background: 'white'
        });
        gsap.to('.line2', 0.5, {
            rotate: '0',
            y: 0,
            background: 'white'
        });
        gsap.to('#logo', 1, {
            color: 'white'
        });
        // maximize the navbar small circle 
        gsap.to('.nav-bar', 1, {
            clipPath: 'circle(50px at 100% -10%)'
        });
        document.body.classList.remove('hide');
    }
}

// Barba Page Transitions
const logo = document.querySelector('#logo');
barba.init({
    views: [{
            namespace: 'home',
            beforeEnter() {
                animateSlides();
                logo.href = './index.html';
            },
            beforeLeave() {
                slideScene.destroy();
                pageScene.destroy();
                controller.destroy();
            }
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html';
                detailAnimation();

            },

            beforeLeave() {
                controller.destroy();
                detailScene.destroy();
            }
        }
    ],
    transistions: [{
        leave({
            current,
            next
        }) {
            let done = this.async();

            const timeLine = gsap.timeline({
                defaults: {
                    ease: 'power2.inOut'
                }
            });
            // fade-out animation
            timeLine.fromTo(current.container, 1, {
                opacity: 1
            }, {
                opacity: 0
            });

            timeLine.fromTo('.swipe', 0.75, {
                    x: '-100%'
                }, {
                    x: '0%',
                    onComplete: done
                },
                '-=0.5');
        },
        enter({
            current,
            next
        }) {
            let done = this.async();
            // scroll to the top
            window.scrollTo(0, 0);
            const timeLine = gsap.timeline({
                defaults: {
                    ease: 'power2.inOut'
                }
            });

            timeLine.fromTo('.swipe', 1, {
                x: '0%'
            }, {
                x: '100%',
                onComplete: done,
                stagger: 0.25 // delay of 0.25 between the swipes
            });

            // fade-in animation on the next container
            timeLine.fromTo(next.container, 1, {
                opacity: 0
            }, {
                opacity: 1
            });
            timeLine.fromTo('.nav-header', 1, {
                y: '-100%'
            }, {
                y: '0%',
                ease: 'power2.inOut'
            }, '-=1.5');
        }

    }]
});

function detailAnimation() {
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');

    slides.forEach((slide, index, slides) => {
        const slideTimeline = gsap.timeline({
            defaults: {
                duration: 1
            }
        });

        let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
        const nextImg = nextSlide.querySelector('img');

        slideTimeLine.fromTo(slide, {
            opacity: 1
        }, {
            opacity: 0
        });

        slideTimeline.fromTo(nextSlide, {
            opacity: 0
        }, {
            opacity: 1
        }, '-=1');

        slideTimeline.fromTo(nextImg, {
            x: '50%'
        }, {
            x: '0%'
        });

        detailScene = new ScrollMagic.Scene({
                triggerElement: slide,
                duration: '100%',
                triggerHook: 0
            })
            .setPin(slide, {
                pushFollowers: false
            })
            .setTween(slideTimeline)
            .addIndicators({
                colorStart: 'white',
                colorTrigger: 'white',
                name: 'detailScene'
            })
            .addTo(controller);
    });

}


window.addEventListener('mousemove', cursorMove);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', toggleNav);


animateSlides();