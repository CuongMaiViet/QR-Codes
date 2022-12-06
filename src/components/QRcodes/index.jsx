import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./index.scss";
import { Button } from "@mui/material";

const QRcodes = () => {
  const [url, setUrl] = useState("");
  const [qr, setQr] = useState("");
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const debouncedHandleResize = debounce(() => {
      setDimensions({ height: window.innerHeight, width: window.innerWidth });
    }, 1000);

    window.addEventListener("resize", debouncedHandleResize);

    return () => window.removeEventListener("resize", debouncedHandleResize);
  }, []);

  const GenerateQRCode = () => {
    const _container = document.getElementById("_container");
    const width = _container.offsetWidth;
    const bgRGBAColor = window.getComputedStyle(_container).backgroundColor;
    const light = rgba2hex(bgRGBAColor);
    const dark = getComplementaryColor(light);

    QRCode.toDataURL(
      url,
      {
        width: width / 4,
        margin: 2,
        color: { dark, light },
        errorCorrectionLevel: "H",
      },
      (err, url) => {
        if (err) return console.error(err);
        console.log(url);
        setQr(url);
      }
    );
  };

  return (
    <div className="_container" id="_container">
      <div className="_qrcode">
        <div className="_qrcode-generate">
          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={GenerateQRCode}
            required
          />
          <Button onClick={GenerateQRCode} variant="contained">
            Generate
          </Button>
        </div>
        {qr && (
          <>
            <img
              src={qr}
              alt="qrcode"
              style={{ width: dimensions.width / 4 }}
            />
            <Button
              href={qr}
              download="qrcode.png"
              variant="contained"
              color="success"
            >
              Download
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QRcodes;

function rgba2hex(rgba) {
  rgba = rgba.match(
    /^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i
  );
  return rgba && rgba.length === 4
    ? "#" +
        ("0" + parseInt(rgba[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgba[3], 10).toString(16)).slice(-2)
    : "";
}

function getComplementaryColor(color = "") {
  const colorPart = color.slice(1);
  const ind = parseInt(colorPart, 16);
  let iter = ((1 << (4 * colorPart.length)) - 1 - ind).toString(16);
  while (iter.length < colorPart.length) {
    iter = "0" + iter;
  }
  return "#" + iter;
}

function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, ms);
  };
}
