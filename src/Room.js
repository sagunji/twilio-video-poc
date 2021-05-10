import React, { useEffect, useState } from "react";
import Participant from "./Participant";

const Room = ({ roomName, room, handleLogout, handleMute, handleVideo }) => {
  const [participants, setParticipants] = useState([]);
  const [isMute, setIsMute] = useState(false);
  const [videoEnabled, isVideoEnabled] = useState(true);

  const toggleMute = () => {
    setIsMute(!isMute);
    toggleAudio();
  }

  const toggleVideo = () => {
    isVideoEnabled(!videoEnabled);
    muteummuteVideo();
  }

  // Use attachng and detaching instead of enabling & disabling
  const toggleAudio = () => {
    var localParticipant = room.localParticipant;
    localParticipant.audioTracks.forEach((audioTrack) => {
    if (audioTrack.isEnabled === true ) {
      audioTrack.track.disable();
    } else {
      audioTrack.track.enable();
    }
    });
  }

  // Use attachng and detaching instead of enabling & disabling 
  const muteummuteVideo = () => {
    var localParticipant = room.localParticipant;
    localParticipant.videoTracks.forEach((videoTrack) => {
      if (videoTrack.isTrackEnabled === true ) {
        videoTrack.track.disable();
      } else {
        videoTrack.track.enable();
      }
    });
  }

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    room.on("participantConnected", participantConnected);
    room.on("participantDisconnected", participantDisconnected);
    room.participants.forEach(participantConnected);
    return () => {
      // dont know its effect

      room.off("participantConnected", participantConnected);
      room.off("participantDisconnected", participantDisconnected);
    };
  }, [room]);

  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  return (
    <div className="room">
      <h2>Room: {roomName}</h2>
      <div className="action-store">
        <button onClick={handleLogout}>Log out</button>
        <button className="child" onClick={toggleMute}>{isMute? "Turn audio on" : "Turn audio off"}</button>
        <button className="child2" onClick={toggleVideo}>{videoEnabled? "Turn Off Video" : "Turn On Video"}</button>
      </div>
      
      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <h3>Remote Participants</h3>
      <div className="remote-participants">{remoteParticipants}</div>
    </div>
  );
};

export default Room;