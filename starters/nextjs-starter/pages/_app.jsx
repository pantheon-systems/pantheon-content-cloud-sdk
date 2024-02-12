import Script from "next/script";
import "../styles/globals.css";
import "@pantheon-systems/nextjs-kit/style.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
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
    </>
  );
}

export default MyApp;
