import { IPm } from "./selector";

export interface IP2PDir {
  give?: IPm;
  get?: IPm;
}

export interface IP2P {
  dirs: IP2PDir[];
}
