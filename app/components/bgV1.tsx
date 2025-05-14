import * as React from "react";

interface SVGComponentProps extends React.SVGProps<SVGSVGElement> {}

const SVGComponent: React.FC<SVGComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={1366}
    zoomAndPan="magnify"
    viewBox="0 0 1024.5 576"
    height={768}
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <defs>
      <style>
        {`
          @keyframes scale1 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          @keyframes scale2 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.8); }
          }
          @keyframes scale3 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          @keyframes scale4 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(0.9); }
          }
          @keyframes scale5 {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
          /* 基础动画类 */
          .animate-scale1 { animation: scale1 4s ease-in-out infinite; }
          .animate-scale2 { animation: scale2 5s ease-in-out infinite; }
          .animate-scale3 { animation: scale3 6s ease-in-out infinite; }
          .animate-scale4 { animation: scale4 4.5s ease-in-out infinite; }
          .animate-scale5 { animation: scale5 5.5s ease-in-out infinite; }
          
          /* 第一组动画元素 */
          .scale1-1 { transform-origin: 23.5px 272.9px; }
          .scale2-1 { transform-origin: 125px 332.7px; }
          .scale3-1 { transform-origin: 65.2px 407.8px; }
          .scale4-1 { transform-origin: 150.7px 429.6px; }
          .scale5-1 { transform-origin: 218.1px 447.8px; }
          
          /* 第二组动画元素 */
          .scale1-2 { transform-origin: 266px 514.9px; }
          .scale2-2 { transform-origin: 349.4px 418.6px; }
          .scale3-2 { transform-origin: 307px 494.9px; }
          .scale4-2 { transform-origin: 609px 542.9px; }
          .scale5-2 { transform-origin: 355px 541.4px; }
          .scale1-3 { transform-origin: 695px 504.9px; }
          .scale5-3 { transform-origin: 484px 505.4px; }
          .scale5-4 { transform-origin: 397.4px 479.3px; }
          
          /* animate-scale3 中的三个元素 */
          .scale3-3 { transform-origin: 858.5px 480.9px; }
          .scale3-4 { transform-origin: 858.3px 495.3px; }
          .scale3-5 { transform-origin: 858.3px 495.3px; }
        `}
      </style>
      <filter x="0%" y="0%" width="100%" height="100%" id="c38c61717a">
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          colorInterpolationFilters="sRGB"
        />
      </filter>
      <mask id="85b56020c2">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="326a248242">
        <path
          d="M 0 1.128906 L 83.292969 1.128906 L 83.292969 120.703125 L 0 120.703125 Z M 0 1.128906 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="9ae876fae0">
        <path
          d="M 23.507812 1.128906 C -9.511719 1.128906 -36.28125 27.898438 -36.28125 60.917969 C -36.28125 93.9375 -9.511719 120.703125 23.507812 120.703125 C 56.527344 120.703125 83.292969 93.9375 83.292969 60.917969 C 83.292969 27.898438 56.527344 1.128906 23.507812 1.128906 Z M 23.507812 1.128906 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="d5fc7b54f8">
        <rect x={0} width={84} y={0} height={121} />
      </clipPath>
      <mask id="c41de2a897">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="86fefa63e7">
        <path
          d="M 14.570312 14.289062 L 149.421875 14.289062 L 149.421875 149.117188 L 14.570312 149.117188 Z M 14.570312 14.289062 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="a2320057fa">
        <path
          d="M 14.570312 14.289062 L 149.414062 14.289062 L 149.414062 149.109375 L 14.570312 149.109375 Z M 14.570312 14.289062 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="4b2d5a53c4">
        <rect x={0} width={164} y={0} height={163} />
      </clipPath>
      <mask id="infinity-mask-1">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="2a734d8810">
        <path
          d="M 5.421875 14.007812 L 124.996094 14.007812 L 124.996094 133.582031 L 5.421875 133.582031 Z M 5.421875 14.007812 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="0ab507c779">
        <path
          d="M 65.210938 14.007812 C 32.191406 14.007812 5.421875 40.773438 5.421875 73.792969 C 5.421875 106.8125 32.191406 133.582031 65.210938 133.582031 C 98.230469 133.582031 124.996094 106.8125 124.996094 73.792969 C 124.996094 40.773438 98.230469 14.007812 65.210938 14.007812 Z M 65.210938 14.007812 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="11b2fd88b8">
        <path
          d="M 5.421875 14.007812 L 124.988281 14.007812 L 124.988281 133.574219 L 5.421875 133.574219 Z M 5.421875 14.007812 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="5a01e3b174">
        <path
          d="M 65.207031 14.007812 C 32.1875 14.007812 5.421875 40.773438 5.421875 73.789062 C 5.421875 106.808594 32.1875 133.574219 65.207031 133.574219 C 98.222656 133.574219 124.988281 106.808594 124.988281 73.789062 C 124.988281 40.773438 98.222656 14.007812 65.207031 14.007812 Z M 65.207031 14.007812 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="08eff1aee4">
        <rect x={0} width={139} y={0} height={147} />
      </clipPath>
      <mask id="96d9feba78">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="e2ff974d90">
        <path
          d="M 14.296875 14.144531 L 149.136719 14.144531 L 149.136719 148.964844 L 14.296875 148.964844 Z M 14.296875 14.144531 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="24c1245418">
        <rect x={0} width={163} y={0} height={163} />
      </clipPath>
      <mask id="617c4f2f76">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="4c2af2e22e">
        <path
          d="M 0.4375 0.117188 L 95.855469 0.117188 L 95.855469 95.539062 L 0.4375 95.539062 Z M 0.4375 0.117188 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="b3244ec5ac">
        <path
          d="M 48.144531 0.117188 C 21.796875 0.117188 0.4375 21.480469 0.4375 47.828125 C 0.4375 74.179688 21.796875 95.539062 48.144531 95.539062 C 74.496094 95.539062 95.855469 74.179688 95.855469 47.828125 C 95.855469 21.480469 74.496094 0.117188 48.144531 0.117188 Z M 48.144531 0.117188 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="300075376b">
        <rect x={0} width={97} y={0} height={96} />
      </clipPath>
      <clipPath id="483532cf7c">
        <path
          d="M 116 454 L 416 454 L 416 575.859375 L 116 575.859375 Z M 116 454 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="8b7d1cb41d">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="3d39ad2c99">
        <path
          d="M 13.105469 13.582031 L 286.605469 13.582031 L 286.605469 121.859375 L 13.105469 121.859375 Z M 13.105469 13.582031 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="835e2f91dc">
        <path
          d="M 149.855469 13.582031 C 74.332031 13.582031 13.105469 74.804688 13.105469 150.332031 C 13.105469 225.855469 74.332031 287.078125 149.855469 287.078125 C 225.378906 287.078125 286.605469 225.855469 286.605469 150.332031 C 286.605469 74.804688 225.378906 13.582031 149.855469 13.582031 Z M 149.855469 13.582031 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="ad90e3c24c">
        <rect x={0} width={300} y={0} height={122} />
      </clipPath>
      <mask id="cc4cb81e44">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="d7698b7852">
        <path
          d="M 0.582031 0.535156 L 77.351562 0.535156 L 77.351562 77.199219 L 0.582031 77.199219 Z M 0.582031 0.535156 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="6f948bec52">
        <rect x={0} width={78} y={0} height={78} />
      </clipPath>
      <clipPath id="2fef4f35d9">
        <path
          d="M 225 414 L 389 414 L 389 575.859375 L 225 575.859375 Z M 225 414 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="d298975ebb">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="9dda634489">
        <path
          d="M 14.617188 14.125 L 149.46875 14.125 L 149.46875 148.953125 L 14.617188 148.953125 Z M 14.617188 14.125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="2e219a4c3c">
        <path
          d="M 14.617188 14.125 L 149.457031 14.125 L 149.457031 148.941406 L 14.617188 148.941406 Z M 14.617188 14.125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="6a75097270">
        <rect x={0} width={164} y={0} height={162} />
      </clipPath>
      <clipPath id="2dd01e73c1">
        <path
          d="M 549 510 L 669 510 L 669 575.859375 L 549 575.859375 Z M 549 510 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="cdbf9c3514">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="38428b86ac">
        <path
          d="M 14.433594 14.492188 L 107.476562 14.492188 L 107.476562 65.859375 L 14.433594 65.859375 Z M 14.433594 14.492188 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="8e1cbe91a6">
        <path
          d="M 14.433594 14.492188 L 107.390625 14.492188 L 107.390625 65.859375 L 14.433594 65.859375 Z M 14.433594 14.492188 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="c83cdd4f0c">
        <rect x={0} width={120} y={0} height={66} />
      </clipPath>
      <clipPath id="2b1162a06c">
        <path
          d="M 307 507 L 403 507 L 403 575.859375 L 307 575.859375 Z M 307 507 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="b969a7ac6d">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="6167de40ff">
        <path
          d="M 0.1875 0.03125 L 95.605469 0.03125 L 95.605469 68.859375 L 0.1875 68.859375 Z M 0.1875 0.03125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="a6ea6927f7">
        <path
          d="M 47.894531 0.03125 C 21.546875 0.03125 0.1875 21.390625 0.1875 47.738281 C 0.1875 74.089844 21.546875 95.449219 47.894531 95.449219 C 74.246094 95.449219 95.605469 74.089844 95.605469 47.738281 C 95.605469 21.390625 74.246094 0.03125 47.894531 0.03125 Z M 47.894531 0.03125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="2eb2e66b99">
        <rect x={0} width={96} y={0} height={69} />
      </clipPath>
      <clipPath id="d3642d51ff">
        <path
          d="M 623 434 L 767 434 L 767 575.859375 L 623 575.859375 Z M 623 434 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="8f5749c5d7">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="d3b77457ae">
        <path
          d="M 14.226562 13.828125 L 130.105469 13.828125 L 130.105469 141.859375 L 14.226562 141.859375 Z M 14.226562 13.828125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="0c1d52e605">
        <rect x={0} width={144} y={0} height={142} />
      </clipPath>
      <clipPath id="infinity-clip-1">
        <path
          d="M 736 386 L 981 386 L 981 575.859375 L 736 575.859375 Z M 736 386 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="87ff446f13">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.16}
          />
        </g>
      </mask>
      <clipPath id="42168d47c5">
        <path
          d="M 14.101562 13.609375 L 230.429688 13.609375 L 230.429688 189.859375 L 14.101562 189.859375 Z M 14.101562 13.609375 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="1534fddd05">
        <path
          d="M 14.101562 13.613281 L 230.417969 13.613281 L 230.417969 189.859375 L 14.101562 189.859375 Z M 14.101562 13.613281 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="d3bd0b3703">
        <rect x={0} width={245} y={0} height={190} />
      </clipPath>
      <clipPath id="7b7a40e83a">
        <path
          d="M 766.042969 414.769531 L 950.566406 414.769531 L 950.566406 575.859375 L 766.042969 575.859375 Z M 766.042969 414.769531 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="0fa751a760">
        <path
          d="M 858.304688 414.769531 C 807.351562 414.769531 766.042969 456.074219 766.042969 507.03125 C 766.042969 557.984375 807.351562 599.292969 858.304688 599.292969 C 909.261719 599.292969 950.566406 557.984375 950.566406 507.03125 C 950.566406 456.074219 909.261719 414.769531 858.304688 414.769531 Z M 858.304688 414.769531 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="15234f4223">
        <path
          d="M 766.042969 414.769531 L 950.453125 414.769531 L 950.453125 575.859375 L 766.042969 575.859375 Z M 766.042969 414.769531 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="a0b2a0861b">
        <path
          d="M 858.300781 414.769531 C 807.347656 414.769531 766.042969 456.074219 766.042969 507.023438 C 766.042969 557.976562 807.347656 599.28125 858.300781 599.28125 C 909.253906 599.28125 950.558594 557.976562 950.558594 507.023438 C 950.558594 456.074219 909.253906 414.769531 858.300781 414.769531 Z M 858.300781 414.769531 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="5ccf3bc37a">
        <path
          d="M 375 435 L 593 435 L 593 575.859375 L 375 575.859375 Z M 375 435 "
          clipRule="nonzero"
        />
      </clipPath>
      <mask id="faa184bf12">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="df35c9741c">
        <path
          d="M 12.902344 12.828125 L 205.34375 12.828125 L 205.34375 140.859375 L 12.902344 140.859375 Z M 12.902344 12.828125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="b8091cc0a2">
        <path
          d="M 109.125 12.828125 C 55.984375 12.828125 12.902344 55.90625 12.902344 109.046875 C 12.902344 162.191406 55.984375 205.269531 109.125 205.269531 C 162.265625 205.269531 205.34375 162.191406 205.34375 109.046875 C 205.34375 55.90625 162.265625 12.828125 109.125 12.828125 Z M 109.125 12.828125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="13b915235a">
        <path
          d="M 12.902344 12.828125 L 205.335938 12.828125 L 205.335938 140.859375 L 12.902344 140.859375 Z M 12.902344 12.828125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="aa03c4fcad">
        <path
          d="M 109.121094 12.828125 C 55.980469 12.828125 12.902344 55.90625 12.902344 109.046875 C 12.902344 162.183594 55.980469 205.261719 109.121094 205.261719 C 162.261719 205.261719 205.335938 162.183594 205.335938 109.046875 C 205.335938 55.90625 162.261719 12.828125 109.121094 12.828125 Z M 109.121094 12.828125 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="0b16d5b468">
        <rect x={0} width={218} y={0} height={141} />
      </clipPath>
      <mask id="7d22f0f1dd">
        <g filter="url(#c38c61717a)">
          <rect
            x={-102.45}
            width={1229.4}
            fill="#000000"
            y={-57.6}
            height={691.2}
            fillOpacity={0.25}
          />
        </g>
      </mask>
      <clipPath id="12a496b69a">
        <path
          d="M 13.734375 13.976562 L 90.503906 13.976562 L 90.503906 90.640625 L 13.734375 90.640625 Z M 13.734375 13.976562 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="395da43e31">
        <path
          d="M 13.734375 13.980469 L 90.199219 13.980469 L 90.199219 90.441406 L 13.734375 90.441406 Z M 13.734375 13.980469 "
          clipRule="nonzero"
        />
      </clipPath>
      <clipPath id="a5921f5237">
        <rect x={0} width={103} y={0} height={104} />
      </clipPath>
    </defs>
    <g mask="url(#85b56020c2)" className="animate-scale1 scale1-1">
      <g transform="matrix(1, 0, 0, 1, 0, 212)">
        <g clipPath="url(#d5fc7b54f8)">
          <g clipPath="url(#326a248242)">
            <g clipPath="url(#9ae876fae0)">
              <path
                fill="#b51e3e"
                d="M -36.28125 1.128906 L 83.292969 1.128906 L 83.292969 120.703125 L -36.28125 120.703125 Z M -36.28125 1.128906 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#c41de2a897)" className="animate-scale2 scale2-1">
      <g transform="matrix(1, 0, 0, 1, 43, 251)">
        <g clipPath="url(#4b2d5a53c4)">
          <g clipPath="url(#86fefa63e7)">
            <path
              fill="#ffffff"
              d="M 14.570312 14.289062 L 149.398438 14.289062 L 149.398438 149.117188 L 14.570312 149.117188 Z M 14.570312 14.289062 "
              fillOpacity={1}
              fillRule="nonzero"
            />
          </g>
          <g clipPath="url(#a2320057fa)">
            <path
              strokeLinecap="butt"
              transform="matrix(0.749634, 0, 0, 0.749634, 14.572123, 14.290633)"
              fill="none"
              strokeLinejoin="miter"
              d="M -0.00241567 -0.0020952 L 179.876993 -0.0020952 L 179.876993 179.846048 L -0.00241567 179.846048 Z M -0.00241567 -0.0020952 "
              stroke="#b51e3e"
              strokeWidth={8}
              strokeOpacity={1}
              strokeMiterlimit={4}
            />
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#9529e91259)" className="animate-scale3 scale3-1">
      <g transform="matrix(1, 0, 0, 1, 0, 334)">
        <g clipPath="url(#08eff1aee4)">
          <g clipPath="url(#2a734d8810)">
            <g clipPath="url(#0ab507c779)">
              <path
                fill="#ffffff"
                d="M 5.421875 14.007812 L 124.996094 14.007812 L 124.996094 133.582031 L 5.421875 133.582031 Z M 5.421875 14.007812 "
                fillOpacity="0.25"
                fillRule="nonzero"
              />
            </g>
          </g>
          <g clipPath="url(#11b2fd88b8)">
            <g clipPath="url(#5a01e3b174)">
              <path
                strokeLinecap="butt"
                transform="matrix(0.749634, 0, 0, 0.749634, 5.423163, 14.00614)"
                fill="none"
                strokeLinejoin="miter"
                d="M 79.750731 0.00223129 C 35.703201 0.00223129 -0.00171769 35.70715 -0.00171769 79.749469 C -0.00171769 123.796999 35.703201 159.501918 79.750731 159.501918 C 123.79305 159.501918 159.497969 123.796999 159.497969 79.749469 C 159.497969 35.70715 123.79305 0.00223129 79.750731 0.00223129 Z M 79.750731 0.00223129 "
                stroke="#b51e3e"
                strokeWidth={8}
                strokeOpacity="0.25"
                strokeMiterlimit={4}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#96d9feba78)" className="animate-scale4 scale4-1">
      <g transform="matrix(1, 0, 0, 1, 69, 348)">
        <g clipPath="url(#24c1245418)">
          <g clipPath="url(#e2ff974d90)">
            <path
              strokeLinecap="butt"
              transform="matrix(0.749634, 0, 0, 0.749634, 14.295112, 14.146143)"
              fill="none"
              strokeLinejoin="miter"
              d="M 0.00235238 -0.00214968 L 179.87655 -0.00214968 L 179.87655 179.845994 L 0.00235238 179.845994 Z M 0.00235238 -0.00214968 "
              stroke="#b51e3e"
              strokeWidth={8}
              strokeOpacity={1}
              strokeMiterlimit={4}
            />
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#617c4f2f76)" className="animate-scale5 scale5-1">
      <g transform="matrix(1, 0, 0, 1, 170, 400)">
        <g clipPath="url(#300075376b)">
          <g clipPath="url(#4c2af2e22e)">
            <g clipPath="url(#b3244ec5ac)">
              <path
                fill="#b51e3e"
                d="M 0.4375 0.117188 L 95.855469 0.117188 L 95.855469 95.539062 L 0.4375 95.539062 Z M 0.4375 0.117188 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#483532cf7c)" className="animate-scale1 scale1-2">
      <g mask="url(#8b7d1cb41d)">
        <g transform="matrix(1, 0, 0, 1, 116, 454)">
          <g clipPath="url(#ad90e3c24c)">
            <g clipPath="url(#3d39ad2c99)">
              <g clipPath="url(#835e2f91dc)">
                <path
                  fill="#ffffff"
                  d="M 13.105469 13.582031 L 286.605469 13.582031 L 286.605469 287.078125 L 13.105469 287.078125 Z M 13.105469 13.582031 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
                <path
                  strokeLinecap="butt"
                  transform="matrix(0.749634, 0, 0, 0.749634, 13.10594, 13.580483)"
                  fill="none"
                  strokeLinejoin="miter"
                  d="M 182.421698 0.00206581 C 81.674633 0.00206581 -0.000629086 81.672117 -0.000629086 182.424393 C -0.000629086 283.171459 81.674633 364.84151 182.421698 364.84151 C 283.168764 364.84151 364.844026 283.171459 364.844026 182.424393 C 364.844026 81.672117 283.168764 0.00206581 182.421698 0.00206581 Z M 182.421698 0.00206581 "
                  stroke="#b51e3e"
                  strokeWidth={8}
                  strokeOpacity={1}
                  strokeMiterlimit={4}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#cc4cb81e44)" className="animate-scale2 scale2-2">
      <g transform="matrix(1, 0, 0, 1, 311, 380)">
        <g clipPath="url(#6f948bec52)">
          <g clipPath="url(#d7698b7852)">
            <path
              fill="#b51e3e"
              d="M 0.582031 0.535156 L 77.246094 0.535156 L 77.246094 77.199219 L 0.582031 77.199219 Z M 0.582031 0.535156 "
              fillOpacity={1}
              fillRule="nonzero"
            />
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#2fef4f35d9)" className="animate-scale3 scale3-2">
      <g mask="url(#d298975ebb)">
        <g transform="matrix(1, 0, 0, 1, 225, 414)">
          <g clipPath="url(#6a75097270)">
            <g clipPath="url(#9dda634489)">
              <path
                fill="#ffffff"
                d="M 14.617188 14.125 L 149.445312 14.125 L 149.445312 148.953125 L 14.617188 148.953125 Z M 14.617188 14.125 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
            <g clipPath="url(#2e219a4c3c)">
              <path
                strokeLinecap="butt"
                transform="matrix(0.749634, 0, 0, 0.749634, 14.61829, 14.124018)"
                fill="none"
                strokeLinejoin="miter"
                d="M -0.00147103 0.00130995 L 179.872727 0.00130995 L 179.872727 179.844243 L -0.00147103 179.844243 Z M -0.00147103 0.00130995 "
                stroke="#b51e3e"
                strokeWidth={8}
                strokeOpacity={1}
                strokeMiterlimit={4}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#2dd01e73c1)" className="animate-scale4 scale4-2">
      <g mask="url(#cdbf9c3514)">
        <g transform="matrix(1, 0, 0, 1, 549, 510)">
          <g clipPath="url(#c83cdd4f0c)">
            <g clipPath="url(#38428b86ac)">
              <path
                fill="#b51e3e"
                d="M 14.433594 14.492188 L 107.457031 14.492188 L 107.457031 106.433594 L 14.433594 106.433594 Z M 14.433594 14.492188 "
                fillOpacity={1}
                fillRule="nonzero"
              />
            </g>
            <g clipPath="url(#8e1cbe91a6)">
              <path
                strokeLinecap="butt"
                transform="matrix(0.749634, 0, 0, 0.749634, 14.434723, 14.491182)"
                fill="none"
                strokeLinejoin="miter"
                d="M -0.00150593 0.00134147 L 124.105922 0.00134147 L 124.105922 122.639303 L -0.00150593 122.639303 Z M -0.00150593 0.00134147 "
                stroke="#b51e3e"
                strokeWidth={8}
                strokeOpacity={1}
                strokeMiterlimit={4}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#2b1162a06c)" className="animate-scale5 scale5-2">
      <g mask="url(#b969a7ac6d)">
        <g transform="matrix(1, 0, 0, 1, 307, 507)">
          <g clipPath="url(#2eb2e66b99)">
            <g clipPath="url(#6167de40ff)">
              <g clipPath="url(#a6ea6927f7)">
                <path
                  fill="#b51e3e"
                  d="M 0.1875 0.03125 L 95.605469 0.03125 L 95.605469 95.449219 L 0.1875 95.449219 Z M 0.1875 0.03125 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#d3642d51ff)" className="animate-scale1 scale1-3">
      <g mask="url(#8f5749c5d7)">
        <g transform="matrix(1, 0, 0, 1, 623, 434)">
          <g clipPath="url(#0c1d52e605)">
            <g clipPath="url(#d3b77457ae)">
              <path
                strokeLinecap="butt"
                transform="matrix(0.749634, 0, 0, 0.749634, 14.227885, 13.828473)"
                fill="none"
                strokeLinejoin="miter"
                d="M -0.00176422 -0.000464091 L 154.578856 -0.000464091 L 154.578856 175.329862 L -0.00176422 175.329862 Z M -0.00176422 -0.000464091 "
                stroke="#b51e3e"
                strokeWidth={8}
                strokeOpacity={1}
                strokeMiterlimit={4}
              />
            </g>
          </g>
        </g>
      </g>
    </g>
    <g clipPath="url(#5ccf3bc37a)" className="animate-scale5 scale5-3">
      <g mask="url(#faa184bf12)">
        <g transform="matrix(1, 0, 0, 1, 375, 435)">
          <g clipPath="url(#0b16d5b468)">
            <g clipPath="url(#df35c9741c)">
              <g clipPath="url(#b8091cc0a2)">
                <path
                  fill="#ffffff"
                  d="M 12.902344 12.828125 L 205.34375 12.828125 L 205.34375 205.269531 L 12.902344 205.269531 Z M 12.902344 12.828125 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
              </g>
            </g>
            <g clipPath="url(#13b915235a)">
              <g clipPath="url(#aa03c4fcad)">
                <path
                  strokeLinecap="butt"
                  transform="matrix(0.749634, 0, 0, 0.749634, 12.904088, 12.828473)"
                  fill="none"
                  strokeLinejoin="miter"
                  d="M 128.351957 -0.000464091 C 57.463208 -0.000464091 -0.00232666 57.46507 -0.00232666 128.35382 C -0.00232666 199.237358 57.463208 256.702893 128.351957 256.702893 C 199.240707 256.702893 256.70103 199.237358 256.70103 128.35382 C 256.70103 57.46507 199.240707 -0.000464091 128.351957 -0.000464091 Z M 128.351957 -0.000464091 "
                  stroke="#b51e3e"
                  strokeWidth={8}
                  strokeOpacity={1}
                  strokeMiterlimit={4}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
    <g mask="url(#7d22f0f1dd)" className="animate-scale5 scale5-4">
      <g transform="matrix(1, 0, 0, 1, 342, 434)">
        <g clipPath="url(#a5921f5237)">
          <g clipPath="url(#12a496b69a)">
            <path
              fill="#ffffff"
              d="M 13.734375 13.976562 L 90.398438 13.976562 L 90.398438 90.640625 L 13.734375 90.640625 Z M 13.734375 13.976562 "
              fillOpacity={1}
              fillRule="nonzero"
            />
          </g>
          <g clipPath="url(#395da43e31)">
            <path
              strokeLinecap="butt"
              transform="matrix(0.749634, 0, 0, 0.749634, 13.735648, 13.981884)"
              fill="none"
              strokeLinejoin="miter"
              d="M -0.0016984 -0.00188827 L 102.392004 -0.00188827 L 102.392004 102.251121 L -0.0016984 102.251121 Z M -0.0016984 -0.00188827 "
              stroke="#b51e3e"
              strokeWidth={8}
              strokeOpacity={1}
              strokeMiterlimit={4}
            />
          </g>
        </g>
      </g>
    </g>
    <g className="animate-scale3 scale3-3">
      <g clipPath="url(#3e80236534)">
        <g mask="url(#87ff446f13)">
          <g transform="matrix(1, 0, 0, 1, 736, 386)">
            <g clipPath="url(#d3bd0b3703)">
              <g clipPath="url(#42168d47c5)">
                <path
                  fill="#b51e3e"
                  d="M 14.101562 13.609375 L 230.324219 13.609375 L 230.324219 229.832031 L 14.101562 229.832031 Z M 14.101562 13.609375 "
                  fillOpacity={1}
                  fillRule="nonzero"
                />
              </g>
              <g clipPath="url(#1534fddd05)">
                <path
                  strokeLinecap="butt"
                  transform="matrix(0.749634, 0, 0, 0.749634, 14.102344, 13.614115)"
                  fill="none"
                  strokeLinejoin="miter"
                  d="M -0.00104188 -0.00111214 L 288.561589 -0.00111214 L 288.561589 288.426036 L -0.00104188 288.426036 Z M -0.00104188 -0.00111214 "
                  stroke="#b51e3e"
                  strokeWidth={8}
                  strokeOpacity={1}
                  strokeMiterlimit={4}
                />
              </g>
            </g>
          </g>
        </g>
      </g>
      <g clipPath="url(#7b7a40e83a)">
        <g clipPath="url(#0fa751a760)">
          <path
            fill="#ffffff"
            d="M 766.042969 414.769531 L 950.566406 414.769531 L 950.566406 599.292969 L 766.042969 599.292969 Z M 766.042969 414.769531 "
            fillOpacity={1}
            fillRule="nonzero"
          />
        </g>
      </g>
      <g clipPath="url(#15234f4223)">
        <g clipPath="url(#a0b2a0861b)">
          <path
            strokeLinecap="butt"
            transform="matrix(0.749634, 0, 0, 0.749634, 766.043546, 414.767647)"
            fill="none"
            strokeLinejoin="miter"
            d="M 123.069686 0.00251401 C 55.099027 0.00251401 -0.00076993 55.102311 -0.00076993 123.067759 C -0.00076993 191.038419 55.099027 246.138215 123.069686 246.138215 C 191.040345 246.138215 246.140142 191.038419 246.140142 123.067759 C 246.140142 55.102311 191.040345 0.00251401 123.069686 0.00251401 Z M 123.069686 0.00251401 "
            stroke="#b51e3e"
            strokeWidth={8}
            strokeOpacity={1}
            strokeMiterlimit={4}
          />
        </g>
      </g>
    </g>
  </svg>
);
export default SVGComponent;
