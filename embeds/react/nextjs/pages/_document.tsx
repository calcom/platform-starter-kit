import type { NextPageContext } from "next";
import type { DocumentContext, DocumentProps } from "next/document";
import Document, { Head, Html, Main, NextScript } from "next/document";


type Props = Record<string, unknown> & DocumentProps;
function setHeader(ctx: NextPageContext, name: string, value: string) {
  try {
    // console.log('Setting header', ctx.res)
    ctx.res?.setHeader(name, value);
  } catch (e) {
    // Getting "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client" when revalidate calendar chache
    console.log(`Error setting header ${name}=${value} for ${ctx.asPath || "unknown asPath"}`, e);
  }
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext) {
    setHeader(ctx, "x-csp", "not-opted-in");
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <Html >
        <Head >
        </Head>

        <body
          className="dark:bg-darkgray-50 desktop-transparent bg-subtle antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
