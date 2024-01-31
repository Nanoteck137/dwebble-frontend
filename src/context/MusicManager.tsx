import { Component, JSX, createContext, useContext } from "solid-js";
import { MusicManager } from "../lib/musicManager";

const MusicManagerContext = createContext<MusicManager>();

export const MusicManagerProvider: Component<{
  musicManager: MusicManager;
  children: JSX.Element;
}> = (props) => {
  return (
    <MusicManagerContext.Provider value={props.musicManager}>
      {props.children}
    </MusicManagerContext.Provider>
  );
};

export const useMusicManager = () => {
  const manager = useContext(MusicManagerContext);
  if (!manager) {
    throw new Error("No MusicManager set");
  }

  return manager;
};
