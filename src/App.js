import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import ProgressiveImage from "react-progressive-graceful-image";

function App() {
  const [hapeNumber, setHapeNumber] = useState("");
  const [votePerc, setVotePerc] = useState("");
  const [hapeInfo, setHapeInfo] = useState("");
  const [hapeImage, setHapeImage] = useState("");
  const [hapeTinyImage, setHapeTinyImage] = useState("");
  const [number, setNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getHapeInfo = (number) => {
    return axios
      .get(`https://haperarity.vercel.app/api/inventory/getUpdatedStats?hapePrimeTokenId=${number}`)
      .then((data) => {
        setHapeInfo(data.data);
        hapeImageHandler(number);
        return axios
          .get(`https://haperarity.vercel.app/api/hapeornot/getVoteData?hapeTokenIds=[${number}]`)
          .then((data) => {
            setNumber(data.data.data[0]?.tokenId);
            setVotePerc(
              Math.round(
                (Number(data.data.data[0]?.winningVotes) / Number(data.data.data[0]?.totalVotes)) *
                  100
              )
            );
          });
      });
  };

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  const hapeImageHandler = (number) => {
    // setHapeImage(`https://d2txl75rmr4hou.cloudfront.net/fit-in/450x450/${number}.png`);
    setHapeImage(`https://meta.hapeprime.com/${number}.png`);
    setHapeTinyImage(`https://d2txl75rmr4hou.cloudfront.net/fit-in/450x450/${number}.png`);
  };
  return (
    <div className="App">
      <div className="input-hape-number">
        <input
          className=""
          type="number"
          value={hapeNumber}
          onChange={(e) => setHapeNumber(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              getHapeInfo(hapeNumber);
            }
          }}
        ></input>
        {/* <button onClick={() => getHapeInfo(hapeNumber)}>Get HAPE!!</button> */}
      </div>

      <div className="wrapper">
        <ProgressiveImage src={hapeImage} placeholder={hapeTinyImage}>
          {(src, loading) => {
            setIsLoading(loading);
            return (
              <img
                style={{ opacity: loading ? 0.2 : 1 }}
                className="hape-image"
                src={src}
                alt="hape"
              />
            );
          }}
        </ProgressiveImage>
        {votePerc !== "" && hapeInfo !== "" && hapeImage !== "" && number !== "" && !isLoading ? (
          <>
            <div className="hape-number">{number}</div>
            <div className="hape-rank">{`Rank : ${hapeInfo.data.rank} / 8192`}</div>
            <div className="hape-votes">{`Votes : ${votePerc}%`}</div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default App;
