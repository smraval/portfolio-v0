class FooterComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          margin: 0;
          padding: 0;
        }

        /* Import ALL the original styles from the main CSS */
        .contact {
          background: transparent;
          text-align: center;
          margin: 0;
          border-top: 1px solid rgba(0,0,0,.10);
          padding: 3rem 2rem;
          font-size: 0.875rem;
          line-height: 1.5;
          width: 100%;
          position: relative;
          box-sizing: border-box;
        }

        .contact p {
          font-family: var(--font-body);
          font-size: 1.25rem;
          color: #6B7280;
          margin: 0 0 1rem 0;
          font-weight: 400;
          text-align: center;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 2rem;
        }

        .contact-links a {
          color: #6B7280;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.125rem;
        }

        .contact-links a:hover {
          color: var(--brand-blue);
          transform: translateY(-2px);
        }

        .contact-links a:hover svg {
          fill: var(--brand-blue);
          transform: translateY(-2px);
        }

        .contact-links svg,
        .contact-links .icon {
          width: 28px;
          height: 28px;
          fill: currentColor;
          display: block;
        }

        .signature {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 0.875rem;
          color: #9CA3AF;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .signature:hover {
          color: var(--brand-blue);
          transform: translateY(-2px);
        }

        .signature::after {
          content: "LAST UPDATED - 12.01.25";
          position: absolute;
          bottom: 100%;
          right: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          transform: translateY(0);
        }

        .signature:hover::after {
          opacity: 1;
          visibility: visible;
          transform: translateY(-10px);
        }

        /* Responsive styles */
        @media (max-width: 480px) {
          .contact {
            padding: 2rem 1rem;
            font-size: 0.8125rem;
          }
          
          .signature {
            position: static !important;
            text-align: center !important;
            margin-top: 1rem !important;
            bottom: auto !important;
            right: auto !important;
            left: auto !important;
            transform: none !important;
            width: 100%;
            display: inline-block;
          }
        }
      </style>

      <footer class="contact">
        <p>feel free to reach out!</p>
        <div class="contact-links">
          <a href="mailto:shalinimraval@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" fill="none" stroke="currentColor" stroke-width="2" />
              <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
          </a>
          <a href="https://github.com/smraval" aria-label="GitHub" target="_blank">
            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M64.0015 2.66602C48.808 2.6739 34.1128 8.05513 22.5434 17.8475C10.974 27.6398 3.2849 41.2047 0.850985 56.1167C-1.58293 71.0286 1.39702 86.3152 9.25806 99.243C17.1191 112.171 29.3486 121.897 43.7597 126.682C46.939 127.272 48.1366 125.301 48.1366 123.626C48.1366 121.951 48.073 117.093 48.0518 111.782C30.2475 115.628 26.4853 104.269 26.4853 104.269C23.5815 96.8924 19.3848 94.9535 19.3848 94.9535C13.5772 91.0124 19.8194 91.0862 19.8194 91.0862C26.2522 91.5393 29.6329 97.6511 29.6329 97.6511C35.3345 107.377 44.6075 104.564 48.2532 102.92C48.8254 98.7997 50.4893 95.9967 52.3227 94.4055C38.1005 92.8038 23.1576 87.3454 23.1576 62.9616C23.0695 56.6378 25.4295 50.5223 29.7495 45.8803C29.0924 44.2786 26.8986 37.8086 30.3747 29.0203C30.3747 29.0203 35.7478 27.3132 47.9777 35.543C58.4676 32.6907 69.5354 32.6907 80.0253 35.543C92.2446 27.3132 97.607 29.0203 97.607 29.0203C101.094 37.7875 98.9 44.2575 98.2429 45.8803C102.577 50.523 104.942 56.6492 104.845 62.9827C104.845 87.4191 89.8706 92.8038 75.6272 94.3739C77.9164 96.355 79.9618 100.222 79.9618 106.165C79.9618 114.68 79.8876 121.529 79.8876 123.626C79.8876 125.323 81.0427 127.304 84.2856 126.682C98.6985 121.896 110.929 112.168 118.79 99.2385C126.651 86.3085 129.629 71.0196 127.193 56.1063C124.756 41.193 117.063 27.6279 105.49 17.8372C93.9166 8.04658 79.2179 2.6689 64.0227 2.66602H64.0015Z"></path>
                <path d="M42.8151 106.535C42.8151 107.051 42.2217 107.494 41.4586 107.504C40.6956 107.515 40.0703 107.093 40.0703 106.577C40.0703 106.061 40.6638 105.618 41.4268 105.608C42.1898 105.597 42.8151 106.008 42.8151 106.535Z"></path>
                <path d="M47.6902 105.724C47.7856 106.24 47.2557 106.777 46.4926 106.904C45.7296 107.03 45.0619 106.725 44.9666 106.219C44.8712 105.713 45.4223 105.165 46.1641 105.028C46.906 104.891 47.5948 105.207 47.6902 105.724Z"></path>
                <path d="M37.5795 106.176C37.4205 106.671 36.6999 106.893 35.9792 106.682C35.2586 106.471 34.7817 105.881 34.9195 105.375C35.0572 104.869 35.7885 104.638 36.5197 104.869C37.251 105.101 37.7173 105.66 37.5795 106.176Z"></path>
                <path d="M32.779 104.112C32.4292 104.502 31.7192 104.396 31.1363 103.87C30.5534 103.343 30.4156 102.626 30.7654 102.247C31.1151 101.867 31.8251 101.973 32.4292 102.489C33.0333 103.006 33.1499 103.733 32.779 104.112V104.112Z"></path>
                <path d="M29.3559 100.571C28.9638 100.845 28.2961 100.571 27.9252 100.023C27.8226 99.9246 27.741 99.8067 27.6853 99.6764C27.6296 99.546 27.6008 99.4058 27.6008 99.2642C27.6008 99.1225 27.6296 98.9823 27.6853 98.852C27.741 98.7216 27.8226 98.6038 27.9252 98.5055C28.3173 98.2421 28.985 98.5055 29.3559 99.0429C29.7268 99.5803 29.7374 100.297 29.3559 100.571V100.571Z"></path>
                <path d="M26.8336 96.9134C26.6142 97.0234 26.3631 97.0541 26.1233 97.0002C25.8836 96.9464 25.6702 96.8114 25.5195 96.6184C25.1062 96.1758 25.0214 95.5646 25.3393 95.2906C25.6572 95.0167 26.2296 95.1431 26.6429 95.5857C27.0562 96.0283 27.1516 96.6394 26.8336 96.9134Z"></path>
                <path d="M24.2371 94.0374C24.0993 94.3535 23.5906 94.4483 23.1773 94.227C22.764 94.0057 22.4567 93.5948 22.605 93.2681C22.7534 92.9415 23.2515 92.8572 23.6648 93.0784C24.0781 93.2997 24.396 93.7212 24.2371 94.0374Z"></path>
                <path d="M105.85 29.825C105.85 34.075 102.4 37.5 98.175 37.5C93.925 37.5 90.5 34.05 90.5 29.825C90.5 25.575 93.95 22.15 98.175 22.15C102.4 22.15 105.85 25.6 105.85 29.825Z"></path>
              </g>
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/shaliniraval" aria-label="LinkedIn" target="_blank">
            <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M118.551 0H9.44889C6.94289 0 4.53953 0.995507 2.76752 2.76752C0.995507 4.53953 0 6.94289 0 9.44889V118.551C0 121.057 0.995507 123.46 2.76752 125.232C4.53953 127.005 6.94289 128 9.44889 128H118.551C121.057 128 123.46 127.005 125.232 125.232C127.005 123.46 128 121.057 128 118.551V9.44889C128 6.94289 127.005 4.53953 125.232 2.76752C123.46 0.995507 121.057 0 118.551 0ZM38.1511 109.04H18.9067V47.9111H38.1511V109.04ZM28.5156 39.44C26.3326 39.4277 24.2022 38.769 22.3933 37.5471C20.5843 36.3252 19.1778 34.5948 18.3513 32.5743C17.5249 30.5539 17.3155 28.3338 17.7495 26.1944C18.1835 24.055 19.2416 22.0921 20.7902 20.5535C22.3387 19.0149 24.3083 17.9694 26.4505 17.5491C28.5926 17.1288 30.8113 17.3525 32.8264 18.1919C34.8416 19.0313 36.5629 20.4489 37.7731 22.2657C38.9834 24.0824 39.6284 26.217 39.6267 28.4C39.6473 29.8615 39.3734 31.3122 38.8214 32.6656C38.2694 34.019 37.4506 35.2475 36.4137 36.2777C35.3769 37.3079 34.1432 38.1188 32.7863 38.6621C31.4293 39.2054 29.9769 39.47 28.5156 39.44ZM109.084 109.093H89.8489V75.6978C89.8489 65.8489 85.6622 62.8089 80.2578 62.8089C74.5511 62.8089 68.9511 67.1111 68.9511 75.9467V109.093H49.7067V47.9556H68.2133V56.4267H68.4622C70.32 52.6667 76.8267 46.24 86.7556 46.24C97.4933 46.24 109.093 52.6133 109.093 71.28L109.084 109.093Z"></path>
              </g>
            </svg>
          </a>
        </div>
        <div class="signature">designed and developed by shalini ˙· 𓆝.°</div>
      </footer>
    `;
  }
}

// Register the custom element
customElements.define('footer-component', FooterComponent);
