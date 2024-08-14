import { Poppins } from "next/font/google";
// import Script from "next/script";

import "../styles/globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

function MyApp({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      {/* Google Analytics: Replace XXXXXXXXXX with your google analytics id and uncomment the following code. */}
      {/* {process.env.NODE_ENV !== "development" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
				window.dataLayer = window.dataLayer || [];
				function gtag(){window.dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-XXXXXXXXXX');
			`}
          </Script>
        </>
      )} */}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
