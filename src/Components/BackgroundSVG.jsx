import "./BackgroundSVG.css";

const BackgroundSVG = () => {
    return (
        <div className="background-svg">
            <svg id='patternId' width='100%' height='100%' xmlns='http://www.w3.org/2000/svg'>
                <defs>
                    <pattern id='a' patternUnits='userSpaceOnUse' width='4' height='4' patternTransform='scale(8)'>
                        <rect x='0' y='0' width='100%' height='100%' fill='hsla(0,0%,100%,1)' />
                        {/* Adjust the width, height, x, and y to reduce space between boxes */}
                        <rect x='0.5' y='0.5' width='3' height='3' rx='1' ry='1' stroke-width='0.1' stroke='hsla(153, 100%, 23%, 1)' fill='none' />
                    </pattern>
                </defs>
                <rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' />
            </svg>
        </div>
    );
};

export default BackgroundSVG;