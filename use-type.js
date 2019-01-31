import { create, Store, Any } from "microstates";
import { useState } from "react";

export default function useType(Type = Any, value) {
  let state;

  state = useState(() => Store(create(Type, value), next => state[1](next)));

  return state[0];
}
