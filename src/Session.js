import React, { useEffect, useState } from 'react';
import Twilio from 'twilio-video';

/**
 * THIS IS JUST FOR POC PURPOSES.
 * NONE OF THIS CODE SHOULD BE USED IN PRODUCTION.
 */

async function addLocalVideo() {
  const track = await Twilio.createLocalVideoTrack();

  let video = document.getElementById('video-bar');

  video?.appendChild(track.attach());
}

async function connect(name, roomName) {
  try {
    const data = await fetch("https://gentle-taiga-97257.herokuapp.com/video/token", {
      method: "POST",
      body: JSON.stringify({
        identity: name,
        room: roomName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    let room = await Twilio.connect(data.token, {
      audio: true,
      video: { height: 480 },
    });

    console.log(room);

    room.participants.forEach(participant => {
      console.log(participant);
      const localParticipant = room.localParticipant;
      console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);

      participant.tracks.forEach((publication) => {
        if (publication.isSubscribed) {
          const track = publication.track;

          document.getElementById('remote-video-bar')?.appendChild(track.attach());
        }
      });

      participant.on('trackSubscribed', (track) => {
        document.getElementById('remote-video-bar')?.appendChild(track.attach());
      });
    });

    room.on('participantConnected', participant => {
      console.log(`A remote participant connected: ${participant}`);

      participant.tracks.forEach((publication) => {
        console.log('a', publication);
        console.log('a', publication.isSubscribed);

        if (publication.isSubscribed) {
          console.log('hi');
          const track = publication.track;
          console.log('here', track);
          document.getElementById('remote-video-bar')?.appendChild(track.attach());
        }
      });

      participant.on('trackSubscribed', (track) => {
        document.getElementById('remote-video-bar')?.appendChild(track.attach());
      });
    });
  } catch (e) {
    console.log(e);
  }
}

const Session = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleRoomChange(e) {
    setRoom(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    connect(name, room);
  }

  useEffect(() => {
    addLocalVideo();
  }, []);

  return (
    <div>
      <h1>Only for testing purposes.</h1>
      <h1>Video Call Demo</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={name} placeholder="Name" onChange={handleNameChange} />
          <input type="text" name="room" value={room} placeholder="Room" onChange={handleRoomChange} />
          <button type="submit">Join</button>
        </form>
      </div>
      <h2>Status</h2>
      <div id="video-bar"></div>
      <div id="remote-video-bar"></div>
    </div>
  );
};

export default Session;
