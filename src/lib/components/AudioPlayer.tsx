const AudioPlayer = () => {
  return (
    <>
      <p>Audio Player</p>
      <p>Name: Track Name</p>
      <p>0:00 / 0:00</p>
      <input
        class="transparent h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200"
        type="range"
      />
    </>
  );
};

export default AudioPlayer;
