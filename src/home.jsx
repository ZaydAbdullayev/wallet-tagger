import React, { useEffect, useState } from "react";
import "./home.css";

const generateNoise = () => {
  const chars = "abcdef0123456789sfE";
  const lines = Array.from({ length: 12 }, () => {
    let line = "";
    for (let i = 0; i < 45; i++) {
      line += chars[Math.floor(Math.random() * chars.length)] + " ";
    }
    return line.trim();
  });
  return lines.join("\n");
};

const tagOptions = [
  "Whale",
  "Airdrop Farmer",
  "Sniper Bot",
  "DEX Liquidity Drainer",
  "Bridge Arbitrageur",
  "Dormant Multi-sig",
  "Exchange Cold Wallet",
];

const redact = (text) => {
  return text
    .split("")
    .map((char, i) => (i % 3 === 0 ? "█" : char))
    .join("");
};

export const App = () => {
  const [asciiNoise, setAsciiNoise] = useState(generateNoise());
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState("");
  const [tagResult, setTagResult] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAsciiNoise(generateNoise());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const shareToX = () => {
    const text = encodeURIComponent(
      `Just tagged a wallet: ${tagResult?.tag}\nhttps://x.com/WalletTagger`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `Wallet: ${tagResult?.address}\nTag: ${tagResult?.tag}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTag = () => {
    if (!input.trim()) return;
    const lines = input.split("\n").filter((line) => line.trim());
    const result = lines.map((line) => {
      const tag = tagOptions[Math.floor(Math.random() * tagOptions.length)];
      return { address: line.trim(), tag };
    });
    setTagResult(result[0]);
  };

  return (
    <div className="retro-container">
      <div className="retro-ui">
        <div className="glitch-overlay"></div>

        <div className="retro-header">
          <span className="retro-title">WALLET TAGGER</span>
          <span className="retro-classified">CLASSIFIED</span>
        </div>

        <p className="scan-line">SCANNING WALLET...</p>

        <textarea
          className="wallet-input"
          rows={4}
          placeholder="Paste wallet address here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        ></textarea>

        <div className="action-button" onClick={handleTag}>
          INITIATE TAGGING
        </div>

        {tagResult && (
          <>
            <div className="tag-box">TAG: {tagResult.tag.toUpperCase()}</div>

            <div className="wallet-hash">
              <code>{redact(tagResult.address)}</code>
            </div>

            <div className="classified-block">
              <p>
                {">"} ENTITY: <span className="blurred">███████</span>
              </p>
              <p>
                {">"} RISK INDEX: <span className="glow">9.7 / 10</span>
              </p>
              <p>
                {">"} AFFILIATION:{" "}
                <span className="strikethrough">DAO-███</span>
              </p>
              <p>
                {">"} LAST SEEN: <span className="blurred">....-..-..</span>
              </p>
            </div>

            <div className="actions">
              <div className="action-btn" onClick={shareToX}>
                SHARE RESULT ON X
              </div>
              <div className="action-btn" onClick={copyToClipboard}>
                {copied ? "COPIED ✔" : "COPY RESULT"}
              </div>
            </div>
          </>
        )}

        <div className="examples-info">
          <p>Examples of airdrop farmers:</p>
          <ul>
            <li>{">"} reveal --classified</li>
            <li>{">"} reveal --wallet</li>
            <li>{">"} reveal --wallet --classified</li>
            <li>{">"} reveal --wallet --classified --explorer</li>
            <li>{">"} reveal --wallet --classified --explorer --rpc</li>
          </ul>
        </div>

        <div className="data-noise">
          <pre>{asciiNoise}</pre>
        </div>
      </div>
    </div>
  );
};
