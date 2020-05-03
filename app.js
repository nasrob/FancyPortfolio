let controller;
let slideScene;
let PageScene;

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

        slideTimeLine.fromTo(nav, {
            y: '-100%'
        }, {
            y: '0%'
        }, '-=0.5');

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

        PageScene = new ScrollMagic.Scene({
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

animateSlides();