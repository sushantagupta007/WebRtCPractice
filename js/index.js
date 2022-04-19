let MyStunServer = "stun:stun.1.google.com:19302";
let MyTurnServer = "turn:numb.viagenie.ca";
let MyTurnUser = "sushanta.gupta007@gmail.com";
let MyPass = "samrat0725";

let StunTurnConfig = {
  config: {
    iceServers: [
      { urls: MyStunServer },
      { urls: MyTurnServer, credential: MyPass, username: MyTurnUser },
    ],
  },
};

let peer = new Peer(StunTurnConfig);
console.log(peer);

peer.on("open", (PeerId) => {
  let peerIdPlace = document.querySelector("#peer1");
  peerIdPlace.innerHTML = `Id: ${PeerId}`;

  console.log(PeerId);
});

const handleConnect = () => {
  const peerId = document.querySelector("input").value;
  let conn = peer.connect(peerId);
  console.log(peerId);
  conn.on("open", () => {
    let statusShow = document.querySelector("#status");
    statusShow.innerHTML = "Connection Status: Yes";
  });
};

let mediaConstraints = { video: true, audio: true };
const handleReceiveCall = () => {
  console.log("clickeds receive");
  peer.on("call", (call) => {
    //Stream Capture
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((stream) => {
        //Display own video
        let Peer2Preview = document.querySelector("#Peer2Preview");
        Peer2Preview.srcObject = stream;
        Peer2Preview.play();

        //Sending peer2 Video to Peer 1
        call.answer(stream);

        call.on("stream", (remoteStream) => {
          //To get sender video
          let Peer1Preview = document.querySelector("#Peer1Preview");
          Peer1Preview.srcObject = remoteStream;
          Peer1Preview.play();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

const handleMakeCall = () => {
  console.log("clickeds make");
  navigator.mediaDevices
    .getUserMedia(mediaConstraints)
    .then((stream) => {
      //Maker preview display in his own computer. Here peer2 is receiver.
      let Peer1Preview = document.querySelector("#Peer1Preview");
      Peer1Preview.srcObject = stream;
      Peer1Preview.play();

      //Partner PeerID
      let PartnerPeerID = document.getElementById("peerInput1").value;
      console.log(PartnerPeerID);
      let call = peer.call(PartnerPeerID, stream);

      call.on("stream", (remoteStream) => {
        //To get sender video
        let Peer2Preview = document.querySelector("#Peer2Preview");
        Peer2Preview.srcObject = remoteStream;
        Peer2Preview.play();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
