import { useEffect } from 'react';
import './Cookiebanner.css';

const GA_TRACKING_ID = 'UA-8196629-3';

const COOKIES = {
  functionalCookies: () => {},
  performanceCookies: () => {},
  marketingCookies: (sendPageView) => {
    /* [GTM] */
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + GA_TRACKING_ID);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, { send_page_view: sendPageView });

    /* [GA] */
    window['GoogleAnalyticsObject'] = 'ga';
    window.ga =
      window.ga ||
      function () {
        (window.ga.q = window.ga.q || []).push(arguments);
      };
    window.ga.l = +new Date();

    window.ga('create', GA_TRACKING_ID);
    window.ga('set', 'anonymizeIp', true);

    window.ga('require', 'ec');
    window.ga('set', 'currencyCode', 'EUR');
  }
};
function readCookie(cookieScreen) {
  const trackingCookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith('privacySettings'));
  const hiddenPages = ['imprint', 'privacy-policy'];

  if (
    hiddenPages.some((v) => window.location.pathname.includes(v)) &&
    !trackingCookie
  )
    return;

  if (trackingCookie) {
    cookieScreen.style.display = 'none';
    const cookieValues = trackingCookie.split('=')[1].split('|');
    let sendPageView = true;

    Object.entries(COOKIES).forEach(([key, value]) => {
      if (cookieValues.includes(key)) {
        value(sendPageView);
      }
    });
  } else {
    cookieScreen.style.display = 'flex';
  }
}

function openCookieSettings(cookieScreen) {
  cookieScreen.style.display = 'flex';
  cookieScreen.querySelector('.cke-box--start').style.display = 'none';
  cookieScreen.querySelector('.cke-box--settings').style.display = 'block';
}

function setCookie(cookieTypes) {
  const yearInSeconds = 60 * 60 * 24 * 365;
  document.cookie =
    'privacySettings=' +
    cookieTypes +
    ';max-age=' +
    yearInSeconds +
    ';SameSite=Lax;path=/;';
}

const Cookiebanner = () => {
  useEffect(() => {
    const openSettingsButton = document.querySelector('.open-cke-settings');
    const acceptCookiesButtons = document.querySelectorAll('.accept-ckes');
    const changeCookiesButtons = document.querySelectorAll('.change-ckes');
    const cookieBoxes = document.querySelectorAll('.cke-box');
    const cookieScreen = document.querySelector('.cke-overlay');
    const openCookieInformations =
      document.querySelectorAll('.cke-content-item');

    if (cookieScreen) {
      readCookie(cookieScreen);
      openSettingsButton?.addEventListener('click', (e) => {
        cookieBoxes.forEach((cookieBox) => {
          if (getComputedStyle(cookieBox).display !== 'none')
            cookieBox.style.display = 'none';
          else if (getComputedStyle(cookieBox).display === 'none')
            cookieBox.style.display = 'block';
        });
      });

      openCookieInformations.forEach((openCookieInformation) => {
        openCookieInformation.addEventListener('click', (e) => {
          if (e.target?.className === 'cke-content-item__text') {
            const cookieInfo = openCookieInformation.querySelector(
              '.cke-content-item__cke-info'
            );

            if (getComputedStyle(cookieInfo).display !== 'none')
              cookieInfo.style.display = 'none';
            else if (getComputedStyle(cookieInfo).display === 'none')
              cookieInfo.style.display = 'block';
          }
        });
      });

      window.onhashchange = function () {
        if (window.location.hash === '#open-cookie-settings') {
          openCookieSettings(cookieScreen);
          var noHashURL = window.location.href.replace(/#.*$/, '');
          window.history.replaceState('', document.title, noHashURL);
        }
      };

      changeCookiesButtons.forEach((changeCookiesButton) => {
        changeCookiesButton.addEventListener('click', (e) => {
          openCookieSettings(cookieScreen);
        });
      });

      acceptCookiesButtons.forEach((acceptCookiesButton) => {
        acceptCookiesButton.addEventListener('click', (e) => {
          const saveSelection = Boolean(e.target.dataset.save || 0);
          let cookieTypes =
            'essentialCookies|functionalCookies|performanceCookies|marketingCookies';

          if (saveSelection === true) {
            const functionalCookies = document.querySelector(
              'input[name=functional_cookies]'
            )?.checked;
            const performanceCookies = document.querySelector(
              'input[name=performance_cookies]'
            )?.checked;
            const marketingCookies = document.querySelector(
              'input[name=marketing_cookies]'
            )?.checked;

            cookieTypes = 'essentialCookies';

            if (functionalCookies) cookieTypes += '|functionalCookies';
            if (performanceCookies) cookieTypes += '|performanceCookies';
            if (marketingCookies) cookieTypes += '|marketingCookies';
          }

          setCookie(cookieTypes);
          readCookie(cookieScreen);
        });
      });
    }
  }, []);

  const infoBox = (
    <div className="cke-content-item">
      <div className="cke-content-item__info">
        We use cookies to provide you with a user-friendly website and for
        marketing. By clicking accept you agree to the terms of our{' '}
        <a
          href="https://img.ly/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          privacy policy
        </a>
        , and help us improve our web presence.
      </div>
    </div>
  );

  if (navigator.userAgent === 'ReactSnap') {
    return <div></div>;
  }

  return (
    <div>
      <div className="cke-overlay">
        <div className="cke-container">
          <div className="cke-box cke-box--start">
            <div className="cke-box__head">
              <h2 className="h2">We’d love to use cookies</h2>
              <h5 className="h5">Help us improve our Website</h5>
            </div>
            <div className="cke-box__content">{infoBox}</div>
            <div className="cke-box__buttons">
              <button className="plain-link open-cke-settings">
                Manage separately or reject all
              </button>
              <button className="button button--primary accept-ckes">
                Accept all cookies
              </button>
            </div>
          </div>
          <div className="cke-box cke-box--settings">
            <div className="cke-box__head">
              <h2 className="h2">We’d love to use cookies</h2>
              <h5 className="h5">Help us improve our Website</h5>
            </div>
            <div className="cke-box__content">
              {infoBox}
              <div className="cke-content-item">
                <div className="cke-content-item__top">
                  <div className="cke-content-item__text">
                    Essential Cookies
                  </div>
                  <label className="cke-content-item__checkbox cke-content-item__checkbox--disabled">
                    <input
                      name="essential_cookies"
                      type="checkbox"
                      className="cke-checkbox"
                      checked
                      disabled
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="cke-content-item__cke-info">
                  ..are necessary for you to browse our website and use its
                  features, such as accessing secure areas of the site. These
                  cookies are first-party session cookies, and do not provide
                  any information that would make you identifiable.
                </div>
              </div>
              <div className="cke-content-item">
                <div className="cke-content-item__top">
                  <div className="cke-content-item__text">
                    Functional Cookies
                  </div>
                  <label className="cke-content-item__checkbox">
                    <input
                      name="functional_cookies"
                      type="checkbox"
                      className="cke-checkbox"
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="cke-content-item__cke-info">
                  ..allow our website to remember choices you have made in the
                  past, like what language you prefer, or what your user name is
                  so you can log in more easily. Generally speaking, they enable
                  us to provide you with a more convenient experience of our
                  website.
                </div>
              </div>
              <div className="cke-content-item">
                <div className="cke-content-item__top">
                  <div className="cke-content-item__text">
                    Performance Cookies
                  </div>
                  <label className="cke-content-item__checkbox">
                    <input
                      name="performance_cookies"
                      type="checkbox"
                      className="cke-checkbox"
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="cke-content-item__cke-info">
                  ..collect information about how you use our website, like
                  which pages you visited and which links you clicked on. These
                  cookies are all aggregated and, therefore, anonymized. None of
                  this information can be used to identify you. It is their sole
                  purpose to improve website functions. This includes cookies
                  from third-party analytics services which are for our
                  exclusive use.
                </div>
              </div>
              <div className="cke-content-item">
                <div className="cke-content-item__top">
                  <div className="cke-content-item__text">
                    Marketing Cookies
                  </div>
                  <label className="cke-content-item__checkbox">
                    <input
                      name="marketing_cookies"
                      type="checkbox"
                      className="cke-checkbox"
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="cke-content-item__cke-info">
                  ..track your online activity and make you identifiable to us.
                  They help us deliver more relevant content to you and
                  therefore improve your user journey. These cookies can share
                  that information with other organizations or advertisers.
                </div>
              </div>
            </div>
            <div className={'cke-box__buttons'}>
              <button
                className="plain-link save-cke-selection accept-ckes"
                data-save="1"
              >
                Save selection
              </button>
              <button className="button button--primary accept-ckes">
                Accept all cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function loadScript(src) {
  var s, r, t;
  r = false;
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  s.onload = s.onreadystatechange = function () {
    if (!r && (!this.readyState || this.readyState === 'complete')) {
      r = true;
    }
  };
  t = document.getElementsByTagName('script')[0];
  t.parentNode.insertBefore(s, t);
}

export default Cookiebanner;
