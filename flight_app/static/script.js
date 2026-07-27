// ===========================
// AeroPredict — 3D Globe + interactions
// ===========================

const CITIES = {
    Delhi: { lat: 28.61, lng: 77.21 },
    Mumbai: { lat: 19.08, lng: 72.88 },
    Kolkata: { lat: 22.57, lng: 88.36 },
    Chennai: { lat: 13.08, lng: 80.27 },
    Banglore: { lat: 12.97, lng: 77.59 },
    Cochin: { lat: 9.93, lng: 76.27 },
    Hyderabad: { lat: 17.38, lng: 78.49 },
};

function buildArcs() {
    const names = Object.keys(CITIES);
    const arcs = [];
    for (let i = 0; i < 14; i++) {
        const a = CITIES[names[Math.floor(Math.random() * names.length)]];
        let b = CITIES[names[Math.floor(Math.random() * names.length)]];
        if (a === b) b = CITIES[names[(names.indexOf(Object.keys(CITIES)[0]) + i) % names.length]];
        arcs.push({
            startLat: a.lat, startLng: a.lng,
            endLat: b.lat, endLng: b.lng,
            color: i % 2 === 0 ? ['#00F0FF', '#7C5CFF'] : ['#7C5CFF', '#00F0FF'],
        });
    }
    return arcs;
}

function initGlobe() {
    const container = document.getElementById('globe-container');
    if (!container || typeof Globe === 'undefined') return;

    const points = Object.values(CITIES).map(c => ({ lat: c.lat, lng: c.lng }));

    const globe = Globe()(container)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#00F0FF')
        .atmosphereAltitude(0.18)
        .arcsData(buildArcs())
        .arcColor('color')
        .arcAltitude(0.25)
        .arcStroke(0.55)
        .arcDashLength(0.5)
        .arcDashGap(1.2)
        .arcDashAnimateTime(3200)
        .pointsData(points)
        .pointColor(() => '#00F0FF')
        .pointAltitude(0.012)
        .pointRadius(0.35)
        .width(window.innerWidth)
        .height(window.innerHeight);

    // Focus on India, slow auto-rotate
    globe.pointOfView({ lat: 20, lng: 78, altitude: 2.1 }, 0);
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom = false;

    window.addEventListener('resize', () => {
        globe.width(window.innerWidth).height(window.innerHeight);
    });
}

function initForm() {
    const form = document.getElementById('predict-form');
    const btn = document.getElementById('predict-btn');
    if (!form || !btn) return;

    form.addEventListener('submit', () => {
        btn.classList.add('loading');
    });

    // Keep result visible on reload: scroll to it if present
    const result = document.querySelector('[data-testid="prediction-result"]');
    if (result) {
        setTimeout(() => result.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 400);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    initForm();
});
