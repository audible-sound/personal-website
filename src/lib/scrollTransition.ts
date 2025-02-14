import AOS from 'aos';
import 'aos/dist/aos.css';

export function aosInit() {
    AOS.init({
        easing: 'ease-in-out',
        once: true
    });
}