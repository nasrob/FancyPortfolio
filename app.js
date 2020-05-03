let controller;
let slideScene;

function animateSlides() {
    //Init Controller
    controller = new ScrollMagic.Controller();

    // select elements
    const sliders = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    // loop over each slide
    sliders.forEach(slide => {
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
            x: '-100%'
        }, {
            x: '0%'
        }, '-=0.75');

        slideTimeLine.fromTo(nav, {
            y: '-100%'
        }, {
            y: '0%'
        }, '-=0.5');
    });
}

animateSlides();